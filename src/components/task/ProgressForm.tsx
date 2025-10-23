import { useState } from "react";
import { apiFetch } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {  AlertCircle } from "lucide-react";

interface MinimalTask {
  _id: string;
  progressFields: { title: string; value: string }[];
  status: string;
}

interface ProgressFormProps {
  taskId: string;
  progressValue?: string;
  onProgressUpdated?: (updatedTask?: MinimalTask) => void;
}

const PROGRESS_OPTIONS = [
  { label: "Not Started", value: "0%" },
  { label: "10%", value: "10%" },
  { label: "25%", value: "25%" },
  { label: "50%", value: "50%" },
  { label: "75%", value: "75%" },
  { label: "90%", value: "90%" },
  { label: "100%", value: "100%" },
];

export default function ProgressForm({
  taskId,
  progressValue,
  onProgressUpdated,
}: ProgressFormProps) {
  const [value, setValue] = useState(progressValue || "0%");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // This function is called automatically when dropdown changes.
  async function handleChange(newValue: string) {
    setValue(newValue);
    setLoading(true);
    setError("");
    

    try {
      // Determine new status based on progress
      let status = "in progress";
      if (newValue === "0%") status = "pending";
      if (newValue === "100%") status = "completed";

      // Update progress
      const res = await apiFetch(`/tasks/${taskId}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ title: "Progress", value: newValue }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // Update status
        await apiFetch(`/tasks/${taskId}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
          headers: { "Content-Type": "application/json" },
        });

        // Fetch updated task
        const updatedTaskRes = await apiFetch(`/tasks/${taskId}`);
        const updatedTask: MinimalTask | undefined = updatedTaskRes.ok
          ? await updatedTaskRes.json()
          : undefined;

        setSuccess(true);

        // Call callback
        onProgressUpdated?.(updatedTask);

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update progress");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger id="progress-value" className="w-full">
          <SelectValue placeholder="Select progress" />
        </SelectTrigger>
        <SelectContent>
          {PROGRESS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* {loading && (
        <div className="flex gap-2 items-center text-gray-400 text-xs mt-1">
          <Loader2 className="w-4 h-4 animate-spin" />
          Updating...
        </div>
      )} */}
      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="animate-in slide-in-from-top-2 border-green-200 bg-green-50 text-green-800">
          <AlertDescription className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            Updated
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}