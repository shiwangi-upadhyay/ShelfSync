import { useState } from "react";
import MemberAutocomplete from "./MemberAutocomplete";

interface TeamFormProps {
  onSubmit: (data: { name: string; memberIds: string[] }) => void;
  initialName?: string;
  initialMembers?: { _id: string; name: string }[];
}

export default function TeamForm({ onSubmit, initialName = "", initialMembers = [] }: TeamFormProps) {
  const [name, setName] = useState(initialName);
  const [members, setMembers] = useState<{ _id: string; name: string }[]>(initialMembers);

  function handleAddMember(user: { _id: string; name: string }) {
    if (!members.some(m => m._id === user._id)) {
      setMembers([...members, user]);
    }
    console.log("Added member:", user);
    console.log("Current members after add:", [...members, user]);
  }

  function handleRemoveMember(userId: string) {
    const updated = members.filter(m => m._id !== userId);
    setMembers(updated);
    console.log("Removed member:", userId);
    console.log("Current members after remove:", updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const memberIds = members.map(m => m._id);
    console.log("Submitting team creation: ", { name, memberIds });
    onSubmit({ name, memberIds }); // correct!
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="border px-3 py-2 rounded w-full"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Team Name"
        required
      />
      <MemberAutocomplete onAdd={handleAddMember} />
      <div className="mt-2">
        {members.map(m => (
          <span key={m._id} className="inline-block bg-gray-200 rounded px-2 py-1 mr-2">
            {m.name}
            <button type="button" className="ml-1 text-red-600" onClick={() => handleRemoveMember(m._id)}>×</button>
          </span>
        ))}
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Save Team
      </button>
    </form>
  );
}