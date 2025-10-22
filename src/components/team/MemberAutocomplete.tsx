"use client";
import { useState, useEffect, useRef, UIEvent } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { CommandList as CmdkCommandList } from "cmdk";
import { Avatar } from "@/components/ui/avatar";
import { apiFetch } from "@/utils/api";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { SearchIcon } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface MemberAutocompleteProps {
  onAdd: (user: User) => void;
}

export default function MemberAutocomplete({ onAdd }: MemberAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const listRef = useRef<HTMLDivElement>(null);

  const LIMIT = 10;

  function fetchUsers(pageNum: number, q: string, replace: boolean = false) {
    console.log("Calling fetchUsers →", { pageNum, q, replace });
    setLoading(true);

    apiFetch(
      `/search?q=${encodeURIComponent(q || "")}&page=${pageNum}&limit=${LIMIT}`
    )
      .then((res: Response) => (res.ok ? res.json() : []))
      .then((data: User[]) => {
        if (replace) setSuggestions(data);
        else setSuggestions((prev: User[]) => [...prev, ...data]);
        setHasMore(data.length === LIMIT);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!open) return;
    const delay = setTimeout(() => {
      console.log("Fetching users for:", query);
      fetchUsers(1, query, true);
    }, 300); // debounce typing

    return () => clearTimeout(delay);
  }, [query, open]);

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage, query);
    }
  }

  return (
    <Popover open={open} onOpenChange={() => setOpen(true)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border px-3 py-2 rounded w-full flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Add member...</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <input
            className="w-full border-none outline-none px-3 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
          />
          <CmdkCommandList
            style={{ maxHeight: 300, overflowY: "auto" }}
            onScroll={handleScroll}
            ref={listRef}
          >
            {loading && suggestions.length === 0 && (
              <div className="px-3 py-2 text-muted-foreground text-sm">
                Loading…
              </div>
            )}
            {!loading && suggestions.length === 0 && (
              <CommandEmpty>No users found.</CommandEmpty>
            )}
            {suggestions.map((user) => (
              <CommandItem
                key={user._id}
                value={user._id}
                onSelect={() => {
                  onAdd(user);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={user.avatarUrl || "/avatar.png"}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </CommandItem>
            ))}
            {loading && suggestions.length > 0 && (
              <div className="px-3 py-2 text-muted-foreground text-sm">
                Loading…
              </div>
            )}
          </CmdkCommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
