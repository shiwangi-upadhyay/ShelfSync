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
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddCommentForm from "@/components/task/AddCommentForm";
import ProgressForm from "@/components/task/ProgressForm";
import { apiFetch } from "@/utils/api";
// import { useState } from "react";

type User = { _id: string; name: string; email: string; avatarUrl?: string };
type Task = {
  _id: string;
  desc: string;
  status: string;
  priority: string;
  assignedTo: User[];
  assignedBy?: User;
  startDate?: string;
  endDate?: string;
  topic?: string;
  subTopic?: string;
  progressFields: { title: string; value: string }[];
  comments: { text: string; by: { name: string } }[];
};

interface TaskTableProps {
  tasks: Task[];
  editable: boolean;
  onTaskUpdated?: (task: Task) => void;
}

export default function TaskTable({
  tasks,
  editable,
  onTaskUpdated,
}: TaskTableProps) {
  const getInitials = (name?: string) =>
    !name
      ? ""
      : name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Done";
      case "in progress":
        return "In Progress";
      case "pending":
        return "Not started";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const calculateTime = (task: Task) => {
    if (!task.startDate || !task.endDate) return "0";
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };

  return (
    <div className=" overflow-hidden bg-white">
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

            <TableHead>{editable ? "Update Progress" : "Progress"}</TableHead>
            <TableHead>Remarks / Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, idx) => (
            <TableRow className="hover:bg-gray-50" key={task._id}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              {/* Assigned To */}
              <TableCell>
                <div className="flex items-center gap-1">
                  {task.assignedTo.length > 0 && (
                    <>
                      <Avatar className="w-6 h-6 bg-violet-50 text-violet-700 border border-violet-300">
                        <AvatarImage src={task.assignedTo[0].avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {getInitials(task.assignedTo[0].name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignedTo[0].name}</span>
                    </>
                  )}
                </div>
              </TableCell>
              {/* Assigned By */}
              <TableCell>
                <div className="flex items-center gap-1">
                  {task.assignedBy && (
                    <>
                      <Avatar className="w-6 h-6 bg-violet-50 text-violet-700 border border-violet-300 ">
                        <AvatarImage src={task.assignedBy.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {getInitials(task.assignedBy.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignedBy.name}</span>
                    </>
                  )}
                </div>
              </TableCell>
              {/* Topic / Context */}
              <TableCell>
                <div className="text-sm">
                  {task.topic && (
                    <div className="font-medium">{task.topic}</div>
                  )}
                  {task.subTopic && (
                    <div className="text-gray-500 text-xs">{task.subTopic}</div>
                  )}
                </div>
              </TableCell>
              {/* Task Description */}
              <TableCell>
                <div className="text-sm">{task.desc}</div>
              </TableCell>
              {/* Status */}
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(task.status)}
                >
                  {getStatusLabel(task.status)}
                </Badge>
              </TableCell>

              {/* Priority */}
              <TableCell>
                <Badge
                  className={
                    task.priority === "high"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : task.priority === "medium"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {task.priority?.charAt(0).toUpperCase() +
                    task.priority?.slice(1)}
                </Badge>
              </TableCell>
              {/* Time */}
              <TableCell className="text-sm text-gray-600">
                {calculateTime(task)}
              </TableCell>
              {/* Start Date */}
              <TableCell className="text-sm text-gray-600">
                {formatDate(task.startDate)}
              </TableCell>
              {/* Due Date */}
              <TableCell className="text-sm text-gray-600">
                {formatDate(task.endDate)}
              </TableCell>
              {/* Completed On */}
              <TableCell className="text-sm text-gray-600">
                {task.status === "completed" ? formatDate(task.endDate) : ""}
              </TableCell>
              <TableCell>
                {editable ? (
                  <ProgressForm
                    taskId={task._id}
                    progressValue={
                      task.progressFields?.length
                        ? task.progressFields[task.progressFields.length - 1]
                            .value
                        : "0%"
                    }
                    onProgressUpdated={
                      onTaskUpdated
                        ? (updated) => {
                            if (updated) onTaskUpdated(updated as Task);
                          }
                        : undefined
                    }
                  />
                ) : (
                  <span>
                    {task.progressFields?.length
                      ? task.progressFields[task.progressFields.length - 1]
                          .value
                      : "0%"}
                  </span>
                )}
              </TableCell>
              {/* Comments */}
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {task.comments?.length || 0}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96" align="end">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">
                        Remarks / Comments
                      </h4>
                      {task.comments && task.comments.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto">
                          {task.comments.map((comment, i) => (
                            <div
                              key={i}
                              className="text-xs bg-gray-50 p-3 rounded border"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-xs">
                                    {getInitials(comment.by?.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold">
                                  {comment.by?.name}:
                                </span>
                              </div>
                              <p className="pl-7">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 text-center py-4">
                          No comments yet
                        </div>
                      )}
                      {editable && (
                        <AddCommentForm
                          taskId={task._id}
                          onCommentAdded={async () => {
                            if (!onTaskUpdated) return;
                            const res = await apiFetch(`/tasks/${task._id}`);
                            if (res.ok) {
                              const updated = await res.json();
                              onTaskUpdated(updated);
                            }
                          }}
                        />
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
