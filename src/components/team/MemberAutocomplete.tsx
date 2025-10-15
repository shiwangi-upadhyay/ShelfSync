import { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Avatar } from "@/components/ui/avatar";
import { apiFetch } from "@/utils/api";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

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

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    apiFetch(`/search?q=${encodeURIComponent(query)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSuggestions(data))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Use a regular input to trigger popover */}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Type to search users"
          className="border px-3 py-2 rounded w-full"
          onFocus={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search users…"
          />
          <CommandList>
            {loading && (
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
                  setQuery("");
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
