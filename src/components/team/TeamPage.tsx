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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { useTeam } from "@/context/TeamContext";
import { useTab } from "@/context/TabContext";
import TaskTable, { TaskItem } from "@/components/task/TaskTable";
import { Button } from "@/components/ui/button";

type User = { _id: string; name: string; email?: string; avatarUrl?: string };

type TeamMember = {
  user: User | string;
  canCreateTask?: boolean;
};

type TeamType = {
  _id?: string;
  name: string;
  admin: User | string;
  members: TeamMember[];
};

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const teamContext = useTeam();
  // typed context values (avoid any)
  const team = teamContext?.team as TeamType | null;
  const setTeam = teamContext?.setTeam as unknown as React.Dispatch<React.SetStateAction<TeamType | null>> | undefined;
  const user = teamContext?.user as User | null;
  const setUser = teamContext?.setUser as unknown as React.Dispatch<React.SetStateAction<User | null>> | undefined;

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activeTab } = useTab();

  // admin editing mode and pending edits
  const [adminEditing, setAdminEditing] = useState(false);
  const [pendingEdits, setPendingEdits] = useState<Record<string, Partial<TaskItem>>>({});

  // fetchAll: stable, memoized callback
  const fetchAll = useCallback(async () => {
    console.debug("[TeamDetailPage] NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.debug("[TeamDetailPage] teamId param:", teamId);
    if (!teamId) {
      console.error("[TeamDetailPage] teamId is undefined — aborting fetchAll");
      setLoading(false);
      setError("Team identifier missing in URL");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [teamRes, tasksRes, meRes] = await Promise.all([
        apiFetch(`/teams/${teamId}`),
        apiFetch(`/tasks/team/${teamId}`),
        apiFetch("/me"),
      ]);

      if (teamRes.status === 403) {
        setForbidden(true);
        setLoading(false);
        return;
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        if (setTeam && (!team || String(team._id) !== String(teamData._id))) {
          setTeam(teamData);
        }
      } else {
        const text = await teamRes.text();
        throw new Error(`Failed to fetch team: ${teamRes.status} ${text}`);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      } else {
        const text = await tasksRes.text();
        throw new Error(`Failed to fetch tasks: ${tasksRes.status} ${text}`);
      }

      if (meRes.ok) {
        const me = await meRes.json();
        if (setUser && (!user || String(user._id) !== String(me._id))) {
          setUser(me);
        }
      }
    } catch (err: unknown) {
      console.error("fetchAll error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [teamId, setTeam, setUser, team, user]);

  // refetchTasks must be a hook (useCallback) and must be declared unconditionally
  const refetchTasks = useCallback(async () => {
    console.debug("[TeamDetailPage] refetchTasks invoked");
    try {
      const res = await apiFetch(`/tasks/team/${teamId}`);
      console.debug("[TeamDetailPage] refetchTasks response ok:", res.ok);
      if (res.ok) {
        const data = await res.json();
        console.debug("[TeamDetailPage] refetchTasks setTasks count:", data.length);
        setTasks(data);
      }
    } catch (err) {
      console.error("[TeamDetailPage] refetchTasks error:", err);
    }
  }, [teamId]);

  // batch editing handlers - stable callbacks declared unconditionally
  const handleEditingStateChange = useCallback((state: Record<string, Partial<TaskItem>>) => {
    setPendingEdits(state);
  }, []);

  const handleSaveAll = useCallback(async () => {
    const entries = Object.entries(pendingEdits);
    if (entries.length === 0) {
      setAdminEditing(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        entries.map(async ([taskId, update]) => {
          // payload typed as unknown-record to avoid any
          const payload: Record<string, unknown> = { ...(update as Record<string, unknown>) };
          if (Array.isArray(payload.assignedTo)) {
            payload.assignedTo = (payload.assignedTo as unknown[]).map((id) => String(id));
          }
          try {
            const res = await apiFetch(`/tasks/${taskId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const json = await res.json();
            return { taskId, ok: true, data: json };
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            return { taskId, ok: false, error: msg };
          }
        })
      );

      const failed = results.filter((r) => !r.ok);
      if (failed.length > 0) {
        const msgs = failed.map((f) => `${f.taskId}: ${f.error}`).join("; ");
        setError(`Failed to update ${failed.length} task(s): ${msgs}`);
        return;
      }

      // all succeeded
      await fetchAll();
      setPendingEdits({});
      setAdminEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("handleSaveAll unexpected error:", msg);
      setError(msg || "Failed to save updates");
    } finally {
      setLoading(false);
    }
  }, [pendingEdits, fetchAll]);

  const handleCancelEdit = useCallback(() => {
    setPendingEdits({});
    setAdminEditing(false);
  }, []);

  // fetch on mount / teamId changes
  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  // dedupe + stable allMembers (useMemo)
  const allMembers = useMemo<User[]>(() => {
    if (!team) return [];
    const items: User[] = [];

    if (team.admin) {
      const adminUser: User = typeof team.admin === "string" ? { _id: team.admin, name: "Unknown" } : (team.admin as User);
      items.push(adminUser);
    }

    (team.members || []).forEach((m) => {
      const u = (m.user ?? m) as User | string;
      const userObj: User = typeof u === "string" ? { _id: u, name: "Unknown" } : (u as User);
      if (!items.find((it) => it._id === userObj._id)) items.push(userObj);
    });

    return items;
  }, [team]);

  // UI early returns (hooks are declared above)
  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;
  if (forbidden) return <div className="text-center py-24 text-2xl text-red-500">You are not a member of this team.</div>;
  if (!team) return <div className="text-center py-20 text-lg">Team not found.</div>;

  const isAdmin = Boolean(user && team.admin && String(user._id) === String((team.admin as User)._id));

  const yourTasks = tasks.filter((task) =>
    (task.assignedTo || []).some((u) => String(typeof u === "string" ? u : (u as User)._id) === String(user?._id))
  );

  return (
    <div className="max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Team: {team.name}</h1>
          <p className="text-sm text-gray-500">Manage tasks and members</p>
        </div>

        {isAdmin && activeTab === "all" && (
          <div className="flex items-center gap-2">
            {!adminEditing ? (
              <Button onClick={() => setAdminEditing(true)} variant="outline">Edit</Button>
            ) : (
              <>
                <Button onClick={handleCancelEdit} variant="ghost">Back</Button>
                <Button onClick={handleSaveAll} variant="secondary">Update</Button>
              </>
            )}
          </div>
        )}
      </div>

      {activeTab === "tasks" && (
        <TaskTable
          tasks={yourTasks}
          editable={false}
          editingMode={adminEditing}
          allowAssigneeEdits={true}
          onEditingStateChange={handleEditingStateChange}
          onTaskUpdated={() => refetchTasks()}
          allMembers={allMembers}
          me={user!}
          teamAdmin={team.admin as User}
        />
      )}

      {activeTab === "all" && (
        <TaskTable
          tasks={tasks}
          editable={isAdmin}
          editingMode={adminEditing}
          allowAssigneeEdits={false}
          onEditingStateChange={handleEditingStateChange}
          onTaskUpdated={() => refetchTasks()}
          allMembers={allMembers}
          me={user!}
          teamAdmin={team.admin as User}
        />
      )}

      {error && <div className="mt-4 text-sm text-red-600">Error: {error}</div>}
    </div>
  );
}