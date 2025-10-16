import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Flag,
  Users,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Circle,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import AddCommentForm from "@/components/task/AddCommentForm";
import ProgressForm from "@/components/task/ProgressForm";
import { useTeam } from "@/context/TeamContext";
import { useState } from "react";
import { apiFetch } from "@/utils/api";

type User = { _id: string; name: string; email: string; avatarUrl?: string };
type ProgressField = { title: string; value: string };
type Comment = { text: string; by: { name: string } };
type Task = {
  _id: string;
  desc: string;
  status: string;
  priority: string;
  assignedTo: User[];
  startDate?: string;
  endDate?: string;
  progressFields: ProgressField[];
  comments: Comment[];
};

interface TaskDetailCardProps {
  task: Task;
  editable: boolean;
  onTaskUpdated?: (task: Task) => void;
}

export default function TaskDetailCard({
  task,
  editable,
  onTaskUpdated,
}: TaskDetailCardProps) {
  const { user } = useTeam() ?? {};
  const [editingProgress, setEditingProgress] = useState<null | ProgressField>(
    null
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "in progress":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <Circle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Parse progress value to extract percentage
  const parseProgress = (value: string) => {
    const match = value.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  };

  // Generate mock trend for demo (in real app, compare with previous values)
  const getTrend = (index: number) => {
    const trends = [13.5, -13.5, 23.5];
    return trends[index % trends.length] || 0;
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Single Unified Card */}
      <Card className="shadow-lg">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl font-bold leading-tight flex-1">
              {task.desc}
            </CardTitle>
            <Badge
              variant={getPriorityColor(task.priority)}
              className="flex items-center gap-1 px-3 py-1"
            >
              <Flag className="w-3 h-3" />
              {task.priority}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${getStatusColor(
                task.status
              )}`}
            >
              {getStatusIcon(task.status)}
              <span className="text-sm font-medium">{task.status}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Assigned Users */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4" />
              Assigned To
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {task.assignedTo.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 bg-gray-50 rounded-full pl-1 pr-3 py-1 border border-gray-200"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Start Date
              </div>
              <div className="text-sm text-gray-600 pl-6">
                {formatDate(task.startDate)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                End Date
              </div>
              <div className="text-sm text-gray-600 pl-6">
                {formatDate(task.endDate)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Tabs for Progress and Comments */}
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Progress
                {task.progressFields && task.progressFields.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {task.progressFields.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments
                {task.comments && task.comments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {task.comments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-4 mt-0">
              {task.progressFields && task.progressFields.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Daily Progress
                  </h3>
                  {task.progressFields.map((pf, i) => {
                    const progress = parseProgress(pf.value);
                    const trend = getTrend(i);
                    const isPositive = trend > 0;
                    const isNegative = trend < 0;

                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              {pf.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {pf.value}
                            </p>
                          </div>
                        </div>
                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">
                  No progress updates yet
                </div>
              )}

              {editable && (
                <>
                  <Separator className="my-4" />
                  <ProgressForm
                    taskId={task._id}
                    onProgressUpdated={async (updatedTask) => {
                      if (!updatedTask) return;
                      // Get the last progress value (assuming newest is last)
                      const lastProgress =
                        updatedTask.progressFields?.[
                          updatedTask.progressFields.length - 1
                        ]?.value;

                      let newStatus = "in progress";
                      if (
                        typeof lastProgress === "string" &&
                        lastProgress.trim().endsWith("100%")
                      ) {
                        newStatus = "completed";
                      }

                      // Only update if status changed
                      if (updatedTask.status !== newStatus) {
                        // PATCH status to backend
                        await apiFetch(`/tasks/${updatedTask._id}/status`, {
                          method: "PATCH",
                          body: JSON.stringify({ status: newStatus }),
                          headers: { "Content-Type": "application/json" },
                        });
                      }
                      // Refetch tasks in parent (this will update the UI)
                      onTaskUpdated?.(updatedTask);
                    }}
                  />
                </>
              )}
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-4 mt-0">
              {task.comments && task.comments.length > 0 ? (
                <div className="space-y-3">
                  {task.comments.map((comment, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2"
                    >
                      {/* <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(comment.by?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900">
                          {comment.by?.name || "Unknown"}
                        </span>
                      </div> */}
                      <p className="text-sm text-gray-700 pl-8">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">
                  No comments yet
                </div>
              )}

              {editable && (
                <>
                  <Separator className="my-4" />
                  <AddCommentForm
                    taskId={task._id}
                    onCommentAdded={() => onTaskUpdated?.(task)}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
