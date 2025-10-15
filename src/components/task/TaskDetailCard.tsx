import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  Flag, 
  Users, 
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Circle
} from "lucide-react";
import AddCommentForm from "@/components/task/AddCommentForm";
import ProgressForm from "@/components/task/ProgressForm";

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
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      case "in progress": return <Clock className="w-4 h-4" />;
      case "pending": return <Circle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
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
      minute: "2-digit"
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Main Task Card */}
      <Card className="shadow-lg">
        <CardHeader className="space-y-4">
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
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${getStatusColor(task.status)}`}>
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
        </CardContent>
      </Card>

      {/* Progress Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Progress Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {task.progressFields && task.progressFields.length > 0 ? (
            <div className="space-y-3">
              {task.progressFields.map((pf, i) => (
                <div 
                  key={i}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">
                      {pf.title}
                    </div>
                    <div className="text-sm text-gray-900 font-semibold">
                      {pf.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-gray-500">
              No progress updates yet
            </div>
          )}
          
          {editable && (
            <>
              <Separator />
              <ProgressForm 
                taskId={task._id} 
                onProgressUpdated={onTaskUpdated} 
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="w-5 h-5" />
            Comments
            {task.comments && task.comments.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {task.comments.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {task.comments && task.comments.length > 0 ? (
            <div className="space-y-3">
              {task.comments.map((comment, i) => (
                <div 
                  key={i}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(comment.by.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">
                      {comment.by.name}
                    </span>
                  </div>
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
              <Separator />
              <AddCommentForm 
                taskId={task._id} 
                onCommentAdded={() => onTaskUpdated?.(task)} 
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}