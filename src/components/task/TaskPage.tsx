// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { apiFetch } from "@/utils/api";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import AddCommentForm from "./AddCommentForm";
// import ProgressForm from "./ProgressForm";

// type Task = {
//   _id: string;
//   desc: string;
//   topic?: string;
//   subTopic?: string;
//   status: string;
//   priority: string;
//   assignedTo: { _id: string; name: string }[];
//   startDate?: string;
//   endDate?: string;
//   comments: { text: string; by: { name: string } }[];
//   progressFields: { title: string; value: string }[];
// };

// export default function TaskDetailPage() {
//   const { taskId } = useParams();
//   const [task, setTask] = useState<Task | null>(null);
//   const [loading, setLoading] = useState(true);

//   async function refreshTask() {
//     const res = await apiFetch(`/tasks/${taskId}`);
//     if (res.ok) setTask(await res.json());
//     setLoading(false);
//   }

//   useEffect(() => {
//     refreshTask();
//     // eslint-disable-next-line
//   }, [taskId]);

//   if (loading) return <div>Loading...</div>;
//   if (!task) return <div>Task not found.</div>;

//   return (
//     <div className="max-w-2xl mx-auto py-8">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">{task.desc}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-2">Status: <span className="font-semibold">{task.status}</span></div>
//           <div className="mb-2">Priority: <span className="font-semibold">{task.priority}</span></div>
//           <div className="mb-2">Assigned: {task.assignedTo.map(u => u.name).join(", ")}</div>
//           {task.topic && <div className="mb-2">Topic: {task.topic}</div>}
//           {task.subTopic && <div className="mb-2">SubTopic: {task.subTopic}</div>}
//           <div className="mb-2">Start: {task.startDate ? new Date(task.startDate).toLocaleString() : "—"}</div>
//           <div className="mb-2">End: {task.endDate ? new Date(task.endDate).toLocaleString() : "—"}</div>
//         </CardContent>
//       </Card>

//       <div className="mt-8">
//         <h2 className="text-lg font-bold mb-2">Comments</h2>
//         <ul className="mb-4">
//           {(task.comments || []).map((c, i) => (
//             <li key={i} className="border-b py-2">{c.text} — <span className="text-xs text-muted-foreground">{c.by.name}</span></li>
//           ))}
//         </ul>
//         <AddCommentForm taskId={task._id} onCommentAdded={refreshTask} />
//       </div>

//       <div className="mt-8">
//         <h2 className="text-lg font-bold mb-2">Progress</h2>
//         <ul className="mb-4">
//           {(task.progressFields || []).map((pf, i) => (
//             <li key={i} className="border-b py-2">{pf.title}: <span className="font-semibold">{pf.value}</span></li>
//           ))}
//         </ul>
//         <ProgressForm taskId={task._id} onProgressUpdated={refreshTask} />
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddCommentForm from "@/components/task/AddCommentForm";
import ProgressForm from "@/components/task/ProgressForm";
import { useTeam } from "@/context/TeamContext";

type User = { _id: string; name: string; email: string; avatarUrl?: string };
type Task = {
  _id: string;
  desc: string;
  status: string;
  priority: string;
  assignedTo: User[];
  startDate?: string;
  endDate?: string;
  progressFields: { title: string; value: string }[];
  comments: { text: string; by: { name: string } }[];
};

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const { user, team } = useTeam() ?? {};
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch task details
  async function refreshTask() {
    const res = await apiFetch(`/tasks/${taskId}`);
    if (res.ok) setTask(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    refreshTask();
  }, [taskId]);

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found.</div>;

  // Logic: Only show editable forms if user is assigned to the task or is team admin
  const isEditable =
    user &&
    (task.assignedTo.some(u => u._id === user._id) ||
      (team && team.admin._id === user._id));

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{task.desc}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            Status: <span className="font-semibold">{task.status}</span>
          </div>
          <div className="mb-2">
            Priority: <span className="font-semibold">{task.priority}</span>
          </div>
          <div className="mb-2">
            Assigned: {task.assignedTo.map(u => u.name).join(", ")}
          </div>
          <div className="mb-2">
            Start: {task.startDate ? new Date(task.startDate).toLocaleString() : "—"}
          </div>
          <div className="mb-2">
            End: {task.endDate ? new Date(task.endDate).toLocaleString() : "—"}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Comments</h2>
        <ul className="mb-4">
          {(task.comments || []).map((c, i) => (
            <li key={i} className="border-b py-2">
              {c.text} — <span className="text-xs text-muted-foreground">{c.by.name}</span>
            </li>
          ))}
        </ul>
        {isEditable && (
          <AddCommentForm taskId={task._id} onCommentAdded={refreshTask} />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Progress</h2>
        <ul className="mb-4">
          {(task.progressFields || []).map((pf, i) => (
            <li key={i} className="border-b py-2">
              {pf.title}: <span className="font-semibold">{pf.value}</span>
            </li>
          ))}
        </ul>
        {isEditable && (
          <ProgressForm taskId={task._id} onProgressUpdated={refreshTask} />
        )}
      </div>
    </div>
  );
}