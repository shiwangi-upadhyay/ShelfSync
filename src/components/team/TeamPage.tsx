// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { apiFetch } from "@/utils/api";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import AddCommentForm from "@/components/task/AddCommentForm";
// import ProgressForm from "@/components/task/ProgressForm";
// import { useTeam } from "@/context/TeamContext";

// type User = { _id: string; name: string; email: string; avatarUrl?: string };
// type Task = {
//   _id: string;
//   desc: string;
//   status: string;
//   priority: string;
//   assignedTo: User[];
//   startDate?: string;
//   endDate?: string;
//   progressFields: { title: string; value: string }[];
//   comments: { text: string; by: { name: string } }[];
// };
// type Team = { _id: string; name: string; admin: User; members: User[] };

// export default function TeamDetailPage() {
//   const { teamId } = useParams();
//   const teamContext = useTeam();
//   const team = teamContext?.team;
//   const setTeam = teamContext?.setTeam;
//   const user = teamContext?.user;
//   const setUser = teamContext?.setUser;
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [forbidden, setForbidden] = useState(false);

//   // Fetch team and user on mount or when teamId changes
//   useEffect(() => {
//     let isMounted = true;
//     async function fetchAll() {
//       // Fetch team
//       const teamRes = await apiFetch(`/teams/${teamId}`);
//       if (!isMounted) return;
//       if (teamRes.status === 403) {
//         setForbidden(true);
//         setLoading(false);
//         return;
//       }
//       if (teamRes.ok) {
//         const teamData = await teamRes.json();
//         if (setTeam) setTeam(teamData);
//         // Fetch tasks for this team
//         const tasksRes = await apiFetch(`/tasks/team/${teamId}`);
//         if (tasksRes.ok) setTasks(await tasksRes.json());
//       }

//       // Fetch current user (only once per mount)
//       const userRes = await apiFetch("/me");
//       if (userRes.ok && setUser) setUser(await userRes.json());

//       setLoading(false);
//     }
//     fetchAll();
//     return () => { isMounted = false; };
//   }, [teamId, setTeam, setUser]);

//   if (loading)
//     return <div className="text-center py-20 text-lg">Loading...</div>;
//   if (forbidden)
//     return (
//       <div className="text-center py-24 text-2xl text-red-500">
//         You are not a member of this team.
//       </div>
//     );
//   if (!team || !user) return <div>Team not found.</div>;

//   // Map member to their tasks
//   const memberTasks: Record<string, Task[]> = {};
//   for (const member of team.members) {
//     memberTasks[member._id] = tasks.filter((task) =>
//       task.assignedTo.some((u) => u._id === member._id)
//     );
//   }

//   const isAdmin = user && team.admin._id === user._id;

//   return (
//     <div className="max-w-5xl mx-auto py-8 space-y-8">
//       {/* Team Info */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">{team.name}</CardTitle>
//           <div className="text-sm text-muted-foreground">
//             Admin: {team.admin.name}
//           </div>
//           <div className="mt-2 flex flex-wrap gap-4">
//             {team.members.map((m: User) => (
//               <div
//               key={m._id}
//               className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1"
//               >
//               <img
//                 src={m.avatarUrl || "/avatar.png"}
//                 alt={m.name}
//                 className="w-6 h-6 rounded-full border"
//               />
//               <span className="font-semibold">{m.name}</span>
//               <span className="text-xs text-muted-foreground">{m.email}</span>
//               </div>
//             ))}
//           </div>
//           {isAdmin && (
//             <div className="mt-4">
//               <Link href={`/teams/${teamId}/task/create`}>
//                 <Button className="bg-green-600 text-white">Create Task</Button>
//               </Link>
//             </div>
//           )}
//         </CardHeader>
//       </Card>

//       {/* Members and their tasks */}
//       <div>
//         <h2 className="text-xl font-bold mb-4">Members & Tasks</h2>
//         {team.members.map((member: User) => (
//           <Card key={member._id} className="mb-6">
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <img
//                   src={member.avatarUrl || "/avatar.png"}
//                   alt={member.name}
//                   className="w-8 h-8 rounded-full border"
//                 />
//                 {member.name}
//                 <span className="text-xs text-muted-foreground">
//                   {member.email}
//                 </span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {memberTasks[member._id]?.length > 0 ? (
//                 memberTasks[member._id].map((task: Task) => (
//                   <div key={task._id} className="mb-4 border-b pb-4">
//                     {/* ...Task details... */}
//                     <ProgressForm
//                       taskId={task._id}
//                       onProgressUpdated={() => {}}
//                     />
//                     <AddCommentForm
//                       taskId={task._id}
//                       onCommentAdded={() => {}}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-sm text-muted-foreground">
//                   No tasks assigned
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { useTeam } from "@/context/TeamContext";
import { useTab } from "@/context/TabContext";
import TaskDetailCard from "../task/TaskDetailCard";
import { TabType } from "../../types/type";

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

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const teamContext = useTeam();
  const team = teamContext?.team;
  const setTeam = teamContext?.setTeam;
  const user = teamContext?.user;
  const setUser = teamContext?.setUser;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const { activeTab } = useTab();

  // Fetch team, user, and tasks
  useEffect(() => {
    let isMounted = true;
    async function fetchAll() {
      const teamRes = await apiFetch(`/teams/${teamId}`);
      if (!isMounted) return;
      if (teamRes.status === 403) {
        setForbidden(true);
        setLoading(false);
        return;
      }
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        if (setTeam) setTeam(teamData);
        // Fetch tasks for this team
        const tasksRes = await apiFetch(`/tasks/team/${teamId}`);
        if (tasksRes.ok) setTasks(await tasksRes.json());
      }
      // Fetch current user
      const userRes = await apiFetch("/me");
      if (userRes.ok && setUser) setUser(await userRes.json());

      setLoading(false);
    }
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [teamId, setTeam, setUser]);

  if (loading)
    return <div className="text-center py-20 text-lg">Loading...</div>;
  if (forbidden)
    return (
      <div className="text-center py-24 text-2xl text-red-500">
        You are not a member of this team.
      </div>
    );
  if (!team || !user) return <div>Team not found.</div>;

  const yourTasks = tasks.filter((task) =>
    task.assignedTo.some((u) => u._id === user._id)
  );

  // Refetch tasks after updates
  function refetchTasks() {
    apiFetch(`/tasks/team/${teamId}`).then((res) => {
      if (res.ok) res.json().then(setTasks);
    });
  }

  // Tab content rendering
  return (
    <div className="max-w-5xl mx-auto py-8">
      {activeTab === "messages" && (
        <div className="text-center text-lg text-gray-400 py-20">
          Coming soon
        </div>
      )}
      {activeTab === "tasks" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
          {yourTasks.length === 0 ? (
            <div className="text-muted-foreground">
              No tasks assigned to you.
            </div>
          ) : (
            yourTasks.map((task) => (
              <TaskDetailCard
                key={task._id}
                task={task}
                editable={true}
                onTaskUpdated={refetchTasks}
              />
            ))
          )}
        </div>
      )}
      {activeTab === "all" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
          {tasks.length === 0 ? (
            <div className="text-muted-foreground">No tasks for this team.</div>
          ) : (
            tasks.map((task) => (
              <TaskDetailCard key={task._id} task={task} editable={false} onTaskUpdated={refetchTasks} />
            ))
          )}
        </div>
      )}
    </div>
  );
}