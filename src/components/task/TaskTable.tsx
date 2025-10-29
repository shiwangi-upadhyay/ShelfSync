import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddCommentForm from "@/components/task/AddCommentForm";
import ProgressForm from "@/components/task/ProgressForm";
import MemberMultiCombobox from "@/components/common/MemberMultiCombobox";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/utils/api";

type User = { _id: string; name: string; email?: string; avatarUrl?: string };

type Comment = { text: string; by?: { name?: string } };
type ProgressField = { title: string; value: string };

export type TaskItem = {
  _id: string;
  desc: string;
  status: string;
  priority: string;
  assignedTo: (User | string)[];
  assignedBy?: User;
  startDate?: string;
  endDate?: string;
  topic?: string;
  subTopic?: string;
  progressFields?: ProgressField[];
  comments?: Comment[];
};

interface TaskTableProps {
  tasks: TaskItem[];
  editable: boolean; // permission flag (admin)
  editingMode?: boolean;
  onEditingStateChange?: (state: Record<string, Partial<TaskItem>>) => void;
  onTaskUpdated?: (task: TaskItem) => void;
  allMembers: User[];
  me: User;
  teamAdmin: User;
  // when true, allow the logged in assignee(s) to update status and progress
  // immediately (used for "your tasks" view)
  allowAssigneeEdits?: boolean;
}

export default function TaskTable({
  tasks,
  editable,
  editingMode = false,
  onEditingStateChange,
  onTaskUpdated,
  allMembers,
  me,
  teamAdmin,
  allowAssigneeEdits = false,
}: TaskTableProps) {
  const [localEdits, setLocalEdits] = useState<Record<string, Partial<TaskItem>>>({});

  // notify parent after localEdits changes (avoids setState during render)
  useEffect(() => {
    if (onEditingStateChange) onEditingStateChange(localEdits);
  }, [localEdits, onEditingStateChange]);

  useEffect(() => {
    if (!editingMode) {
      setLocalEdits({});
      if (onEditingStateChange) onEditingStateChange({});
    }
  }, [editingMode, onEditingStateChange]);

  const isAdmin = Boolean(me && teamAdmin && String(me._id) === String(teamAdmin._id) && editable);

  const comboboxMembers = useMemo(() => allMembers.map((u) => ({ user: u })), [allMembers]);

  const getValue = useCallback(<K extends keyof TaskItem>(task: TaskItem, field: K) => {
    return (localEdits[task._id] && (localEdits[task._id] as any)[field]) ?? (task as any)[field];
  }, [localEdits]);

  const setPendingField = useCallback(<K extends keyof TaskItem>(taskId: string, field: K, value: TaskItem[K]) => {
    setLocalEdits(prev => ({ ...prev, [taskId]: { ...(prev[taskId] ?? {}), [field]: value } }));
  }, []);

  const getInitials = (name?: string) => !name ? "" : name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2);
  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US") : "";
  const formatInputDate = (d?: string) => d ? new Date(d).toISOString().slice(0,10) : "";
  const calculateTime = (task: TaskItem) => {
    if (!task.startDate || !task.endDate) return "0";
    const start = new Date(task.startDate), end = new Date(task.endDate);
    return Math.ceil(Math.abs(end.getTime() - start.getTime())/(1000*60*60*24)).toString();
  };

  const handleAssigneeStatusChange = useCallback(async (taskId: string, value: string) => {
    try {
      const res = await apiFetch(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: value }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const updated = await res.json();
        if (onTaskUpdated) onTaskUpdated(updated as TaskItem);
      } else {
        // no-op; in a full app you'd surface this to the user
        console.error("Failed to update status for", taskId, "status", value);
      }
    } catch (err) {
      console.error("handleAssigneeStatusChange error:", err);
    }
  }, [onTaskUpdated]);

  const isMember = useMemo(() => {
    return allMembers.some(m => String(m._id) === String(me._id));
  }, [allMembers, me._id]);

  return (
    <div className="overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Assigned By</TableHead>
            <TableHead>Topic / Context</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Start date</TableHead>
            <TableHead>Due on</TableHead>
            <TableHead>Completed On</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Remarks / Comment</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((task, idx) => {
            const assignedToRaw = getValue(task, "assignedTo") as (User | string)[] | undefined;
            const assignedIds = Array.isArray(assignedToRaw) ? assignedToRaw.map(a => typeof a === "string" ? a : (a as User)._id) : [];
            const assignedUsers = assignedIds.map(id => allMembers.find(m => String(m._id) === String(id)) || { _id: id, name: "Unknown" });
            const lastProgress = task.progressFields && task.progressFields.length ? task.progressFields[task.progressFields.length -1].value : "0%";
            const comments = task.comments ?? [];
            const commentsCount = comments.length;

            return (
              <TableRow key={task._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{idx + 1}</TableCell>

                <TableCell>
                  {editingMode && isAdmin ? (
                    <MemberMultiCombobox members={comboboxMembers} value={assignedIds} onChange={(ids) => setPendingField(task._id, "assignedTo", ids as any)} widthClassName="w-56" />
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      {assignedUsers.length > 0 ? assignedUsers.map(u => (
                        <div key={String((u as any)._id)} className="flex items-center gap-2 mr-3">
                          <Avatar className="w-6 h-6 bg-violet-50 text-violet-700 border border-violet-300">
                            {(u as any).avatarUrl ? <AvatarImage src={(u as any).avatarUrl} alt={(u as any).name} /> : <AvatarFallback className="text-xs">{getInitials((u as any).name)}</AvatarFallback>}
                          </Avatar>
                          <span className="text-sm">{(u as any).name}</span>
                        </div>
                      )) : <span className="text-sm text-gray-500">Unassigned</span>}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {task.assignedBy && <>
                      <Avatar className="w-6 h-6 bg-violet-50 text-violet-700 border border-violet-300">{task.assignedBy.avatarUrl ? <AvatarImage src={task.assignedBy.avatarUrl} alt={task.assignedBy.name} /> : <AvatarFallback className="text-xs">{getInitials(task.assignedBy.name)}</AvatarFallback>}</Avatar>
                      <span className="text-sm">{task.assignedBy.name}</span>
                    </>}
                  </div>
                </TableCell>

                <TableCell>
                  {editingMode && isAdmin ? (
                    <>
                      <Input value={String(getValue(task, "topic") ?? "")} onChange={(e) => setPendingField(task._id, "topic", e.target.value)} placeholder="Topic" />
                      <Input value={String(getValue(task, "subTopic") ?? "")} onChange={(e) => setPendingField(task._id, "subTopic", e.target.value)} placeholder="Subtopic" className="mt-1" />
                    </>
                  ) : (
                    <div className="text-sm">{task.topic && <div className="font-medium">{task.topic}</div>}{task.subTopic && <div className="text-gray-500 text-xs">{task.subTopic}</div>}</div>
                  )}
                </TableCell>

                <TableCell>
                  {editingMode && isAdmin ? <Input value={String(getValue(task, "desc") ?? "")} onChange={(e) => setPendingField(task._id, "desc", e.target.value)} placeholder="Description" /> : <div className="text-sm">{task.desc}</div>}
                </TableCell>

                <TableCell>
                  {editingMode && isAdmin ? (
                    <Select value={String(getValue(task, "status") ?? task.status)} onValueChange={(val) => setPendingField(task._id, "status", val)}>
                      <SelectTrigger>{String(getValue(task, "status") ?? task.status)}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not started">Not started</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Done</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    // allow assignees to update status directly for "your tasks"
                    (allowAssigneeEdits && assignedIds.includes(String(me._id))) ? (
                      <Select value={String(getValue(task, "status") ?? task.status)} onValueChange={(val) => handleAssigneeStatusChange(task._id, val)}>
                        <SelectTrigger>{String(getValue(task, "status") ?? task.status)}</SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not started">Not started</SelectItem>
                          <SelectItem value="in progress">In Progress</SelectItem>
                          <SelectItem value="completed">Done</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">{String(getValue(task, "status") ?? task.status)}</Badge>
                    )
                  )}
                </TableCell>

                <TableCell>
                  {editingMode && isAdmin ? (
                    <Select value={String(getValue(task, "priority") ?? task.priority)} onValueChange={(val) => setPendingField(task._id, "priority", val)}>
                      <SelectTrigger>{String(getValue(task, "priority") ?? task.priority)}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : <Badge>{String(getValue(task, "priority") ?? task.priority)}</Badge>}
                </TableCell>

                <TableCell className="text-sm text-gray-600">{calculateTime(task)}</TableCell>

                <TableCell>{editingMode && isAdmin ? <Input type="date" value={formatInputDate(String(getValue(task, "startDate") ?? task.startDate))} onChange={(e) => setPendingField(task._id, "startDate", e.target.value)} /> : <span className="text-sm text-gray-600">{formatDate(task.startDate)}</span>}</TableCell>

                <TableCell>{editingMode && isAdmin ? <Input type="date" value={formatInputDate(String(getValue(task, "endDate") ?? task.endDate))} onChange={(e) => setPendingField(task._id, "endDate", e.target.value)} /> : <span className="text-sm text-gray-600">{formatDate(task.endDate)}</span>}</TableCell>

                <TableCell className="text-sm text-gray-600">{String(getValue(task, "status") ?? task.status) === "completed" ? formatDate(task.endDate) : ""}</TableCell>

                <TableCell>{((editingMode && isAdmin) || (allowAssigneeEdits && assignedIds.includes(String(me._id)))) ? <ProgressForm taskId={task._id} progressValue={lastProgress} onProgressUpdated={async (updated) => { if (onTaskUpdated && updated) onTaskUpdated(updated as TaskItem); }} /> : <span>{lastProgress}</span>}</TableCell>

                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3 py-2" aria-label={`Open comments for task ${task._id}`}>
                        <MessageSquare className="w-4 h-4" />
                        <span className={commentsCount > 0 ? "text-sm text-sky-600 font-medium" : "text-sm text-muted-foreground"}>{commentsCount}</span>
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-96" align="end">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Remarks / Comments</h4>
                        {comments.length > 0 ? <div className="max-h-64 overflow-y-auto space-y-2">{comments.map((comment, i) => <div key={i} className="text-xs bg-gray-50 p-3 rounded border"><div className="flex items-center gap-2 mb-1"><Avatar className="w-5 h-5"><AvatarFallback className="text-xs">{getInitials(comment.by?.name)}</AvatarFallback></Avatar><span className="font-semibold">{comment.by?.name ?? "Unknown"}:</span></div><p className="pl-7">{comment.text}</p></div>)}</div> : <div className="text-xs text-gray-500 text-center py-4">No comments yet</div>}

                        {isMember ? <AddCommentForm taskId={task._id} onCommentAdded={async () => { if (!onTaskUpdated) return; const res = await apiFetch(`/tasks/${task._id}`); if (res.ok) { const updated = await res.json(); onTaskUpdated(updated); } }} /> : <div className="text-xs text-gray-500 text-center py-2">Only team members can add comments</div>}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}