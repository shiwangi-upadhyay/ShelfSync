// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { apiFetch } from "@/utils/api";
// import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface Member {
//   user: { _id: string; name: string };
//   canCreateTask: boolean;
// }

// interface TeamType {
//   admin: { _id: string; name: string };
//   members: Member[];
//   name: string;
// }

// interface TaskForm {
//   assignedTo: string[];
//   desc: string;
//   topic: string;
//   subTopic: string;
//   startDate: string;
//   endDate: string;
//   priority: "low" | "medium" | "high";
// }

// export default function CreateTaskPage() {
//   const { teamId } = useParams();
//   const [team, setTeam] = useState<TeamType | null>(null);
//   const [tasks, setTasks] = useState<TaskForm[]>([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const router = useRouter();
//   const [me, setMe] = useState<{ _id: string; name: string } | null>(null);

//   // fetch /me on mount
//   useEffect(() => {
//     async function fetchMe() {
//       try {
//         const res = await apiFetch("/me");
//         if (res.ok) setMe(await res.json());
//       } catch {}
//     }
//     fetchMe();
//   }, []);

//   useEffect(() => {
//     async function fetchTeam() {
//       try {
//         const res = await apiFetch(`/teams/${teamId}`);
//         if (res.ok) {
//           const teamData = await res.json();
//           setTeam(teamData);

//           const nonAdminMembers = teamData.members.filter(
//             (m: Member) => m.user._id !== teamData.admin._id
//           );

//           const initialTasks = nonAdminMembers.map((m: Member) => ({
//             assignedTo: [m.user._id],
//             desc: "",
//             topic: "",
//             subTopic: "",
//             startDate: "",
//             endDate: "",
//             priority: "medium" as const,
//           }));
//           setTasks(initialTasks);
//         }
//       } catch (err) {
//         console.log(err);
//         setError("Failed to load team data");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTeam();
//   }, [teamId]);

//   function handleTaskChange(idx: number, field: keyof TaskForm, value: string) {
//     setTasks((tasks) =>
//       tasks.map((task, i) => (i === idx ? { ...task, [field]: value } : task))
//     );
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     if (!team || !me) return;
//     setSubmitting(true);

//     try {
//       const isAllowed =
//         team.admin._id === me._id ||
//         team.members.some((m) => m.user._id === me._id && m.canCreateTask);

//       if (!isAllowed) {
//         setError("You do not have permission to create tasks");
//         setSubmitting(false);
//         return;
//       }

//       const validTasks = tasks.filter(
//         (t) => t.desc.trim() && t.startDate.trim()
//       );

//       if (validTasks.length === 0) {
//         setError("Add at least one task description and start date");
//         setSubmitting(false);
//         return;
//       }

//       const missingStartDate = tasks.some(
//         (t) => t.desc.trim() && !t.startDate.trim()
//       );
//       if (missingStartDate) {
//         setError("All tasks with a description must have a start date.");
//         setSubmitting(false);
//         return;
//       }

//       const res = await apiFetch("/tasks", {
//         method: "POST",
//         body: JSON.stringify({ teamId, tasks: validTasks }),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (res.ok) {
//         router.push(`/teams/${teamId}`);
//       } else {
//         const data = await res.json();
//         setError(data.error || "Failed to create tasks");
//       }
//     } catch (err) {
//       console.log(err);
//       setError("Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
//       </div>
//     );
//   }

//   const canCreateTask =
//     me &&
//     team &&
//     (team.admin._id === me._id ||
//       team.members.some((m) => m.user._id === me._id && m.canCreateTask));

//   if (!loading && !canCreateTask) {
//     return (
//       <div className="flex flex-col items-center py-20 text-gray-500">
//         <AlertCircle className="w-8 h-8 mb-4" />
//         <div>You do not have permission to create tasks for this team.</div>
//         <Link href={`/teams/${teamId}`} className="mt-4">
//           <Button>Back to Team</Button>
//         </Link>
//       </div>
//     );
//   }

//   const nonAdminMembers =
//     team?.members.filter((m: Member) => m.user._id !== team.admin._id) || [];

//   const filledCount = tasks.filter((t) => t.desc.trim()).length;

//   return (
//     <div className="max-w-6xl mx-auto px-4">
//       {/* Header */}
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-semibold text-gray-900 mb-1">
//             Create Tasks
//           </h1>
//           <p className="text-sm text-gray-500">
//             {team?.name} • {filledCount} of {nonAdminMembers.length} assigned
//           </p>
//           {team?.admin && (
//             <p className="text-xs text-gray-400">Admin: {team.admin.name}</p>
//           )}
//         </div>
//         <Link href={`/teams/${teamId}`}>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="mb-4 -ml-3 text-gray-500"
//           >
//             Back
//             <ArrowRight className="w-4 h-4 mr-1" />
//           </Button>
//         </Link>
//       </div>

//       {/* Error */}
//       {error && (
//         <Alert variant="destructive" className="mb-6">
//           <AlertCircle className="w-4 h-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {/* Table Form */}
//       <form onSubmit={handleSubmit}>
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Member</TableHead>
//                 <TableHead>Description</TableHead>
//                 <TableHead>Topic</TableHead>
//                 <TableHead>Subtopic</TableHead>
//                 <TableHead>Start Date</TableHead>
//                 <TableHead>Due Date</TableHead>
//                 <TableHead>Priority</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {nonAdminMembers.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={7}
//                     className="text-center py-12 text-gray-500"
//                   >
//                     No team members to assign tasks to
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 nonAdminMembers.map((member, idx) => {
//                   const task = tasks[idx];
//                   return (
//                     <TableRow key={member.user._id}>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <span>{member.user.name}</span>
//                           {member.canCreateTask && (
//                             <Badge
//                               variant="outline"
//                               className="text-xs text-violet-700 border-violet-300 bg-violet-50"
//                             >
//                               Can create task
//                             </Badge>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           placeholder="Task description"
//                           value={task?.desc || ""}
//                           onChange={(e) =>
//                             handleTaskChange(idx, "desc", e.target.value)
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           placeholder="Topic"
//                           value={task?.topic || ""}
//                           onChange={(e) =>
//                             handleTaskChange(idx, "topic", e.target.value)
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           placeholder="Subtopic"
//                           value={task?.subTopic || ""}
//                           onChange={(e) =>
//                             handleTaskChange(idx, "subTopic", e.target.value)
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           type="date"
//                           value={task?.startDate || ""}
//                           onChange={(e) =>
//                             handleTaskChange(idx, "startDate", e.target.value)
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           type="date"
//                           value={task?.endDate || ""}
//                           onChange={(e) =>
//                             handleTaskChange(idx, "endDate", e.target.value)
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           {(["low", "medium", "high"] as const).map(
//                             (priority) => (
//                               <button
//                                 key={priority}
//                                 type="button"
//                                 onClick={() =>
//                                   handleTaskChange(idx, "priority", priority)
//                                 }
//                                 className={`py-1 px-3 rounded-md capitalize transition ${
//                                   task?.priority === priority
//                                     ? "bg-violet-600 text-white"
//                                     : "bg-violet-100 text-black-600 hover:bg-violet-200 border border-transparent hover:border-violet-300"
//                                 }`}
//                               >
//                                 {priority}
//                               </button>
//                             )
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {nonAdminMembers.length > 0 && (
//           <Button
//             type="submit"
//             disabled={filledCount === 0 || submitting}
//             className="w-[200px] h-11 bg-violet-600 hover:bg-violet-500 border border-transparent hover:border-violet-600 items-center cursor-pointer justify-center flex mx-auto mt-8"
//           >
//             {submitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               `Create ${filledCount} Task${filledCount !== 1 ? "s" : ""}`
//             )}
//           </Button>
//         )}
//       </form>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MemberMultiCombobox } from "@/components/common/MemberMultiCombobox"; // adjust path if needed

interface Member {
  user: { _id: string; name: string };
  canCreateTask: boolean;
  isAdmin?: boolean;
}

interface TeamType {
  admin: { _id: string; name: string };
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
  const [tasks, setTasks] = useState<TaskForm[]>([
    {
      assignedTo: [],
      desc: "",
      topic: "",
      subTopic: "",
      startDate: "",
      endDate: "",
      priority: "medium",
    },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [me, setMe] = useState<{ _id: string; name: string } | null>(null);

  // fetch /me on mount
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await apiFetch("/me");
        if (res.ok) setMe(await res.json());
      } catch {}
    }
    fetchMe();
  }, []);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await apiFetch(`/teams/${teamId}`);
        if (res.ok) {
          const teamData = await res.json();
          setTeam(teamData);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, [teamId]);

  // All members, including admin, for dropdown
  const allMembers: Member[] = team
    ? [
        { user: team.admin, canCreateTask: true, isAdmin: true },
        ...team.members.filter((m) => m.user._id !== team.admin._id),
      ]
    : [];

  function handleTaskChange(idx: number, field: keyof TaskForm, value: any) {
    setTasks((tasks) =>
      tasks.map((task, i) => (i === idx ? { ...task, [field]: value } : task))
    );
  }

  function handleAddRow() {
    setTasks((tasks) => [
      ...tasks,
      {
        assignedTo: [""],
        desc: "",
        topic: "",
        subTopic: "",
        startDate: "",
        endDate: "",
        priority: "medium",
      },
    ]);
  }

  function handleRemoveRow(idx: number) {
    setTasks((tasks) => tasks.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!team || !me) return;
    setSubmitting(true);

    try {
      const isAllowed =
        team.admin._id === me._id ||
        team.members.some((m) => m.user._id === me._id && m.canCreateTask);

      if (!isAllowed) {
        setError("You do not have permission to create tasks");
        setSubmitting(false);
        return;
      }

      const validTasks = tasks.filter(
        (t) =>
          t.desc.trim() &&
          t.startDate.trim() &&
          Array.isArray(t.assignedTo) &&
          t.assignedTo.length > 0
      );

      if (validTasks.length === 0) {
        setError(
          "Add at least one task with a member, description and start date"
        );
        setSubmitting(false);
        return;
      }

      const missingStartDate = tasks.some(
        (t) => t.desc.trim() && !t.startDate.trim()
      );
      if (missingStartDate) {
        setError("All tasks with a description must have a start date.");
        setSubmitting(false);
        return;
      }

      console.log("team id and valid task", teamId, validTasks);

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
      console.log(err);
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

  const canCreateTask =
    me &&
    team &&
    (team.admin._id === me._id ||
      team.members.some((m) => m.user._id === me._id && m.canCreateTask));

  if (!loading && !canCreateTask) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-500">
        <AlertCircle className="w-8 h-8 mb-4" />
        <div>You do not have permission to create tasks for this team.</div>
        <Link href={`/teams/${teamId}`} className="mt-4">
          <Button>Back to Team</Button>
        </Link>
      </div>
    );
  }

  const filledCount = tasks.filter((t) => t.desc.trim()).length;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Create Tasks
          </h1>
          <p className="text-sm text-gray-500">
            {team?.name} • {filledCount} of {tasks.length} filled
          </p>
          {team?.admin && (
            <p className="text-xs text-gray-400">Admin: {team.admin.name}</p>
          )}
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

      {/* Table Form */}
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assign To</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Subtopic</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-gray-500"
                  >
                    No tasks. Click "Add Row" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <MemberMultiCombobox
                        members={allMembers}
                        value={task.assignedTo}
                        onChange={(val) =>
                          handleTaskChange(idx, "assignedTo", val)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Task description"
                        value={task.desc}
                        onChange={(e) =>
                          handleTaskChange(idx, "desc", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Topic"
                        value={task.topic}
                        onChange={(e) =>
                          handleTaskChange(idx, "topic", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Subtopic"
                        value={task.subTopic}
                        onChange={(e) =>
                          handleTaskChange(idx, "subTopic", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={task.startDate}
                        onChange={(e) =>
                          handleTaskChange(idx, "startDate", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={task.endDate}
                        onChange={(e) =>
                          handleTaskChange(idx, "endDate", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {(["low", "medium", "high"] as const).map(
                          (priority) => (
                            <button
                              key={priority}
                              type="button"
                              onClick={() =>
                                handleTaskChange(idx, "priority", priority)
                              }
                              className={`py-1 px-3 rounded-md capitalize transition ${
                                task.priority === priority
                                  ? "bg-violet-600 text-white"
                                  : "bg-violet-100 text-black-600 hover:bg-violet-200 border border-transparent hover:border-violet-300"
                              }`}
                            >
                              {priority}
                            </button>
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRow(idx)}
                        disabled={tasks.length === 1}
                        className="text-gray-400"
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Button
          type="button"
          className="mt-4 bg-gray-200 text-gray-700"
          onClick={handleAddRow}
        >
          + Add Row
        </Button>
        <Button
          type="submit"
          disabled={tasks.every((t) => !t.desc.trim()) || submitting}
          className="w-[200px] h-11 bg-violet-600 hover:bg-violet-500 border border-transparent hover:border-violet-600 items-center cursor-pointer justify-center flex mx-auto mt-8"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            `Create ${tasks.filter((t) => t.desc.trim()).length} Task${
              tasks.filter((t) => t.desc.trim()).length !== 1 ? "s" : ""
            }`
          )}
        </Button>
      </form>
    </div>
  );
}
