import { useState } from "react";
import { apiFetch } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddCommentFormProps {
  taskId: string;
  onCommentAdded?: () => void;
}

export default function AddCommentForm({ taskId, onCommentAdded }: AddCommentFormProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await apiFetch(`/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setText("");
      if (onCommentAdded) onCommentAdded();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add comment");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
      <Input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a comment"
        required
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !text}>
        Post
      </Button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}