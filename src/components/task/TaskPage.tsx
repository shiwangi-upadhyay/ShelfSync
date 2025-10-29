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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { useTeam } from "@/context/TeamContext";
import { useTab } from "@/context/TabContext";
import TaskTable, { TaskItem } from "@/components/task/TaskTable";
import { Button } from "@/components/ui/button";

type User = { _id: string; name: string; email?: string; avatarUrl?: string };

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const teamContext = useTeam();
  const team = teamContext?.team as any | null;
  const setTeam = teamContext?.setTeam;
  const user = teamContext?.user as User | null;
  const setUser = teamContext?.setUser;
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activeTab } = useTab();

  // admin editing mode and pending edits (batched)
  const [adminEditing, setAdminEditing] = useState(false);
  const [pendingEdits, setPendingEdits] = useState<Record<string, Partial<TaskItem>>>({});

  const fetchAll = useCallback(async () => {
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
    } catch (err: any) {
      console.error("fetchAll error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [teamId, setTeam, setUser, team, user]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  // dedupe + stable allMembers
  const allMembers = useMemo(() => {
    if (!team) return [];
    const items: User[] = [];
    if (team.admin)
      items.push({
        _id: String(team.admin._id),
        name: team.admin.name,
        email: team.admin.email ?? "",
        avatarUrl: team.admin.avatarUrl ?? undefined,
      });

    (team.members || []).forEach((m: any) => {
      const u = m?.user ?? m;
      if (u)
        items.push({
          _id: String(u._id),
          name: u.name ?? "Unknown",
          email: u.email ?? "",
          avatarUrl: u.avatarUrl ?? undefined,
        });
    });

    const map = new Map<string, User>();
    for (const u of items) if (!map.has(u._id)) map.set(u._id, u);
    return Array.from(map.values());
  }, [team]);

  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;
  if (forbidden) return <div className="text-center py-24 text-2xl text-red-500">You are not a member of this team.</div>;
  if (!team) return <div className="text-center py-20 text-lg">Team not found.</div>;

  const isAdmin = Boolean(user && team.admin && String(user._id) === String(team.admin._id));

  const yourTasks = tasks.filter((task) => (task.assignedTo || []).some((u) => String(typeof u === "string" ? u : (u as any)?._id) === String(user?._id)));

  const refetchTasks = useCallback(async () => {
    try {
      const res = await apiFetch(`/tasks/team/${teamId}`);
      if (res.ok) setTasks(await res.json());
    } catch (err) {
      console.error("refetchTasks error:", err);
    }
  }, [teamId]);

  // Parent receives batched edits from TaskTable via onEditingStateChange.
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
      const results = await Promise.all(entries.map(async ([taskId, update]) => {
        const payload: any = { ...update };
        if (payload.assignedTo) payload.assignedTo = (payload.assignedTo as any[]).map((id) => String(id));
        try {
          const res = await apiFetch(`/tasks/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = await res.json();
          return { taskId, ok: true, data: json };
        } catch (err: any) {
          return { taskId, ok: false, error: err?.message || String(err) };
        }
      }));

      const failed = results.filter(r => !r.ok);
      if (failed.length > 0) {
        const msgs = failed.map(f => `${f.taskId}: ${f.error}`).join("; ");
        setError(`Failed to update ${failed.length} task(s): ${msgs}`);
        return;
      }

      // All succeeded: refresh and exit edit mode
      await fetchAll();
      setPendingEdits({});
      setAdminEditing(false);
    } catch (err: any) {
      console.error("handleSaveAll unexpected error:", err);
      setError(err?.message || "Failed to save updates");
    } finally {
      setLoading(false);
    }
  }, [pendingEdits, fetchAll]);

  const handleCancelEdit = useCallback(() => {
    setPendingEdits({});
    setAdminEditing(false);
  }, []);

  return (
    <div className="max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Team: {team.name}</h1>
          <p className="text-sm text-gray-500">Manage tasks and members</p>
        </div>

        {isAdmin && (
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
          editable={isAdmin}
          editingMode={adminEditing}
          onEditingStateChange={handleEditingStateChange}
          onTaskUpdated={() => refetchTasks()}
          allMembers={allMembers}
          me={user!}
          teamAdmin={team.admin}
        />
      )}

      {activeTab === "all" && (
        <TaskTable
          tasks={tasks}
          editable={isAdmin}
          editingMode={adminEditing}
          onEditingStateChange={handleEditingStateChange}
          onTaskUpdated={() => refetchTasks()}
          allMembers={allMembers}
          me={user!}
          teamAdmin={team.admin}
        />
      )}

      {error && <div className="mt-4 text-sm text-red-600">Error: {error}</div>}
    </div>
  );
}