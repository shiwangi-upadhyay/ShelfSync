"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Member {
  _id: string;
  name: string;
}

interface TeamType {
  admin: Member;
  members: Member[];
  name: string;
}

interface TaskForm {
  assignedTo: string[];
  desc: string;
  topic: string;
  subTopic: string;
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
}

export default function CreateTaskPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<TeamType | null>(null);
  const [tasks, setTasks] = useState<TaskForm[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await apiFetch(`/teams/${teamId}`);
        if (res.ok) {
          const teamData = await res.json();
          setTeam(teamData);

          const nonAdminMembers = teamData.members.filter(
            (m: Member) => m._id !== teamData.admin._id
          );

          const initialTasks = nonAdminMembers.map((m: Member) => ({
            assignedTo: [m._id],
            desc: "",
            topic: "",
            subTopic: "",
            startDate: "",
            endDate: "",
            priority: "medium" as const,
          }));
          setTasks(initialTasks);
        }
      } catch (err) {
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, [teamId]);

  function handleTaskChange(idx: number, field: keyof TaskForm, value: string) {
    setTasks((tasks) =>
      tasks.map((task, i) => (i === idx ? { ...task, [field]: value } : task))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!team) return;
    setSubmitting(true);

    try {
      const userRes = await apiFetch("/me");
      const me = userRes.ok ? await userRes.json() : null;

      if (!me || team.admin._id !== me._id) {
        setError("Only the team admin can create tasks");
        setSubmitting(false);
        return;
      }

      // Only tasks with both desc and startDate
      const validTasks = tasks.filter(
        (t) => t.desc.trim() && t.startDate.trim()
      );

      if (validTasks.length === 0) {
        setError("Add at least one task description and start date");
        setSubmitting(false);
        return;
      }

      // If any filled desc is missing startDate, show error
      const missingStartDate = tasks.some(
        (t) => t.desc.trim() && !t.startDate.trim()
      );
      if (missingStartDate) {
        setError("All tasks with a description must have a start date.");
        setSubmitting(false);
        return;
      }

      const res = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ teamId, tasks: validTasks }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push(`/teams/${teamId}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create tasks");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const nonAdminMembers =
    team?.members.filter((m: Member) => m._id !== team.admin._id) || [];

  const filledCount = tasks.filter((t) => t.desc.trim()).length;

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Create Tasks
          </h1>
          <p className="text-sm text-gray-500">
            {team?.name} • {filledCount} of {nonAdminMembers.length} assigned
          </p>
        </div>
        <Link href={`/teams/${teamId}`}>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-3 text-gray-500"
          >
            Back
            <ArrowRight className="w-4 h-4 mr-1" />
          </Button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {nonAdminMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No team members to assign tasks to
          </div>
        ) : (
          nonAdminMembers.map((member, idx) => {
            const task = tasks[idx];
            const isFilled = task?.desc.trim();

            return (
              <div
                key={member._id}
                className={`border rounded-lg p-6 transition ${
                  isFilled ? "border-gray-900 bg-gray-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  {isFilled && (
                    <span className="text-xs text-gray-500">✓ Assigned</span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`desc-${idx}`} className="text-sm">
                      Description
                    </Label>
                    <Input
                      id={`desc-${idx}`}
                      placeholder="Task description"
                      value={task?.desc || ""}
                      onChange={(e) =>
                        handleTaskChange(idx, "desc", e.target.value)
                      }
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor={`topic-${idx}`}
                        className="text-sm text-gray-600"
                      >
                        Topic
                      </Label>
                      <Input
                        id={`topic-${idx}`}
                        placeholder="Optional"
                        value={task?.topic || ""}
                        onChange={(e) =>
                          handleTaskChange(idx, "topic", e.target.value)
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`subtopic-${idx}`}
                        className="text-sm text-gray-600"
                      >
                        Subtopic
                      </Label>
                      <Input
                        id={`subtopic-${idx}`}
                        placeholder="Optional"
                        value={task?.subTopic || ""}
                        onChange={(e) =>
                          handleTaskChange(idx, "subTopic", e.target.value)
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor={`start-${idx}`}
                        className="text-sm text-gray-600"
                      >
                        Start
                      </Label>
                      <Input
                        id={`start-${idx}`}
                        type="date"
                        value={task?.startDate || ""}
                        onChange={(e) =>
                          handleTaskChange(idx, "startDate", e.target.value)
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`end-${idx}`}
                        className="text-sm text-gray-600"
                      >
                        Due
                      </Label>
                      <Input
                        id={`end-${idx}`}
                        type="date"
                        value={task?.endDate || ""}
                        onChange={(e) =>
                          handleTaskChange(idx, "endDate", e.target.value)
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">
                      Priority
                    </Label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as const).map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() =>
                            handleTaskChange(idx, "priority", priority)
                          }
                          className={`flex-1 py-2 text-sm rounded-md capitalize transition ${
                            task?.priority === priority
                              ? "bg-violet-600 text-white"
                              : "bg-violet-100 text-black-600 hover:bg-violet-200 border border-transparent hover:border-violet-300"
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {nonAdminMembers.length > 0 && (
          <Button
            type="submit"
            disabled={filledCount === 0 || submitting}
            className="w-[200px] h-11 bg-violet-600 hover:bg-violet-500 border border-transparent hover:border-violet-600 items-center cursor-pointer justify-center flex mx-auto mt-4"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              `Create ${filledCount} Task${filledCount !== 1 ? "s" : ""}`
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
