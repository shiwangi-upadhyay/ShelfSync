import { useState } from "react";
import { apiFetch } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProgressFormProps {
  taskId: string;
  onProgressUpdated?: () => void;
}

export default function ProgressForm({ taskId, onProgressUpdated }: ProgressFormProps) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await apiFetch(`/tasks/${taskId}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ title, value }),
    });
    if (res.ok) {
      setTitle("");
      setValue("");
      if (onProgressUpdated) onProgressUpdated();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update progress");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
      <Input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Progress Title (e.g. 'Design', 'Review')"
        required
        disabled={loading}
      />
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Progress Value (e.g. 'Done', 'In Review', '50%')"
        required
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !title || !value}>
        Update
      </Button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}