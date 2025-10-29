import React, { useMemo, useState, useId } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserSummary = { _id: string; name: string; avatarUrl?: string };

type Member = {
  user: UserSummary | null;
  isAdmin?: boolean;
};

interface MemberMultiComboboxProps {
  members: Member[];
  value: string[]; // selected user IDs
  onChange: (value: string[]) => void;
  placeholder?: string;
  widthClassName?: string;
  showAvatar?: boolean;
  ariaLabel?: string;
}

export function MemberMultiCombobox({
  members,
  value,
  onChange,
  placeholder = "Select members",
  widthClassName = "w-56",
  showAvatar = true,
  ariaLabel = "Select team members",
}: MemberMultiComboboxProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Normalize and filter out invalid entries (memoized)
  const normalized = useMemo(
    () =>
      (members || [])
        .map((m) => (m && m.user && m.user._id ? m : null))
        .filter(Boolean) as Member[],
    [members]
  );

  const searchLower = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!searchLower) return normalized;
    return normalized.filter((m) => (m!.user!.name ?? "").toLowerCase().includes(searchLower));
  }, [normalized, searchLower]);

  const handleToggle = (userId: string) => {
    // Toggle selection and notify parent
    if (value.includes(userId)) {
      onChange(value.filter((id) => id !== userId));
    } else {
      onChange([...value, userId]);
    }
  };

  const selectedNames = useMemo(
    () => normalized.filter((m) => m.user && value.includes(m.user!._id)).map((m) => m.user!.name),
    [normalized, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={`member-combobox-${id}`}
          aria-label={ariaLabel}
          className={`${widthClassName} justify-between`}
        >
          {value.length === 0 ? placeholder : selectedNames.length > 0 ? selectedNames.join(", ") : `${value.length} selected`}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-40 p-0" id={`member-combobox-${id}`}>
        <Command>
          <CommandInput placeholder="Search members..." value={search} onValueChange={setSearch} aria-label="Search members" />
          <CommandList>
            {filtered.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">No members found.</div>
            ) : (
              filtered.map((member) => {
                const userId = member.user!._id;
                const userName = member.user!.name ?? "Unknown";
                const avatarUrl = member.user!.avatarUrl;
                // stable key: userId (member.user guaranteed present by normalized/filtered)
                return (
                  <CommandItem
                    key={userId}
                    value={userId}
                    onSelect={() => handleToggle(userId)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                    aria-checked={value.includes(userId)}
                    role="option"
                  >
                    <div className="flex items-center gap-2">
                      {showAvatar ? (
                        <Avatar className="w-5 h-5">
                          {avatarUrl ? <AvatarImage src={avatarUrl} alt={userName} /> : <AvatarFallback className="text-xs">{userName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback>}
                        </Avatar>
                      ) : null}
                      <span className="text-sm">{userName}</span>
                      {member.isAdmin && <span className="ml-2 text-xs text-gray-500">(Admin)</span>}
                    </div>

                    {value.includes(userId) && <Check className="ml-auto h-4 w-4 text-violet-600" />}
                  </CommandItem>
                );
              })
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default MemberMultiCombobox;