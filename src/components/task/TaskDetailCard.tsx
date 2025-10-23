// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Calendar,
//   Clock,
//   Flag,
//   Users,
//   MessageSquare,
//   TrendingUp,
//   CheckCircle2,
//   AlertCircle,
//   Circle,
// } from "lucide-react";
// import AddCommentForm from "@/components/task/AddCommentForm";
// import ProgressForm from "@/components/task/ProgressForm";

// type User = { _id: string; name: string; email: string; avatarUrl?: string };
// type Task = {
//   _id: string;
//   desc: string;
//   status: string;
//   priority: string;
//   assignedTo: User[];
//   assignedBy?: User; // <-- Add this line!
//   startDate?: string;
//   endDate?: string;
//   progressFields: { title: string; value: string }[];
//   comments: { text: string; by: { name: string } }[];
// };

// interface TaskDetailCardProps {
//   task: Task;
//   editable: boolean;
//   onTaskUpdated?: (task: Task) => void;
// }

// export default function TaskDetailCard({
//   task,
//   editable,
//   onTaskUpdated,
// }: TaskDetailCardProps) {
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "in progress":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "completed":
//         return <CheckCircle2 className="w-4 h-4" />;
//       case "in progress":
//         return <Clock className="w-4 h-4" />;
//       case "pending":
//         return <Circle className="w-4 h-4" />;
//       default:
//         return <AlertCircle className="w-4 h-4" />;
//     }
//   };

//   const getInitials = (name?: string) => {
//     if (!name || typeof name !== "string") return "";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };
//   // Priority badge styles
//   const getPriorityBadgeClass = (priority: string) => {
//     switch (priority.toLowerCase()) {
//       case "high":
//         return "bg-red-100 text-red-700 border border-red-400";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-400";
//       case "low":
//         return "bg-green-100 text-green-700 border border-green-400";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-300";
//     }
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "—";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-6">
//       {/* Single Unified Card */}
//       <Card className="shadow-lg">
//         <CardHeader className="space-y-4 pb-4">
//           <div className="flex items-start justify-between gap-4">
//             <CardTitle className="text-2xl font-bold leading-tight flex-1">
//               {task.desc}
//             </CardTitle>
//             <span
//               className={
//                 "flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold " +
//                 getPriorityBadgeClass(task.priority)
//               }
//             >
//               <Flag className="w-3 h-3" />
//               {task.priority}
//             </span>
//           </div>

//           <div className="flex items-center gap-2">
//             <div
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${getStatusColor(
//                 task.status
//               )}`}
//             >
//               {getStatusIcon(task.status)}
//               <span className="text-sm font-medium">{task.status}</span>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {/* Assigned Users */}
//           {/* Assigned Users */}
//           <div className="space-y-3">
//             <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
//               <Users className="w-4 h-4" />
//               Assigned To
//             </div>
//             <div className="flex flex-wrap items-center gap-3">
//               {task.assignedTo.map((user) => (
//                 <div
//                   key={user._id}
//                   className="flex items-center gap-2 bg-gray-50 rounded-full pl-1 pr-3 py-1 border border-gray-200"
//                 >
//                   <Avatar className="w-7 h-7">
//                     <AvatarImage src={user.avatarUrl} />
//                     <AvatarFallback className="text-xs">
//                       {getInitials(user.name)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm font-medium">{user.name}</span>
//                 </div>
//               ))}
//             </div>
//             {/* Assigned By */}
//             {task.assignedBy && (
//               <div className="flex items-center gap-2 mt-1 pl-1">
//                 <span className="text-xs text-gray-500">Assigned by</span>
//                 <Avatar className="w-6 h-6">
//                   <AvatarImage src={task.assignedBy.avatarUrl} />
//                   <AvatarFallback className="text-xs">
//                     {getInitials(task.assignedBy.name)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <span className="text-xs text-gray-600">
//                   {task.assignedBy.name}
//                 </span>
//               </div>
//             )}
//           </div>

//           <Separator />

//           {/* Timeline */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                 <Calendar className="w-4 h-4" />
//                 Start Date
//               </div>
//               <div className="text-sm text-gray-600 pl-6">
//                 {formatDate(task.startDate)}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                 <Clock className="w-4 h-4" />
//                 End Date
//               </div>
//               <div className="text-sm text-gray-600 pl-6">
//                 {formatDate(task.endDate)}
//               </div>
//             </div>
//           </div>

//           <Separator />

//           {/* Tabs for Progress and Comments */}
//           <Tabs defaultValue="progress" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 mb-4">
//               <TabsTrigger value="progress" className="flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4" />
//                 Progress
//                 {task.progressFields && task.progressFields.length > 0 && (
//                   <Badge variant="secondary" className="ml-1">
//                     {task.progressFields.length}
//                   </Badge>
//                 )}
//               </TabsTrigger>
//               <TabsTrigger value="comments" className="flex items-center gap-2">
//                 <MessageSquare className="w-4 h-4" />
//                 Comments
//                 {task.comments && task.comments.length > 0 && (
//                   <Badge variant="secondary" className="ml-1">
//                     {task.comments.length}
//                   </Badge>
//                 )}
//               </TabsTrigger>
//             </TabsList>

//             {/* Progress Tab */}
//             <TabsContent value="progress" className="space-y-4 mt-0">
//               {/* Show Current Progress */}
//               {task.progressFields && task.progressFields.length > 0 ? (
//                 <div className="space-y-4">
//                   <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-700">
//                           Current Progress
//                         </h3>
//                         <p className="text-2xl font-bold text-gray-900 mt-1">
//                           {
//                             task.progressFields[task.progressFields.length - 1]
//                               .value
//                           }
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-700">
//                         Current Progress
//                       </h3>
//                       <p className="text-2xl font-bold text-gray-900 mt-1">
//                         Not Started
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Update Progress Form (if editable) */}
//               {editable && (
//                 <>
//                   <Separator className="my-4" />
//                   <ProgressForm
//                     taskId={task._id}
//                     progressValue={
//                       task.progressFields?.length
//                         ? task.progressFields[task.progressFields.length - 1]
//                             .value
//                         : "0%"
//                     }
//                     onProgressUpdated={(updatedTask) => {
//                       if (updatedTask && onTaskUpdated) {
//                         onTaskUpdated(updatedTask as Task);
//                       }
//                     }}
//                   />
//                 </>
//               )}
//             </TabsContent>

//             {/* Comments Tab */}
//             <TabsContent value="comments" className="space-y-4 mt-0">
//               {task.comments && task.comments.length > 0 ? (
//                 <div className="space-y-3">
//                   {task.comments.map((comment, i) => (
//                     <div
//                       key={i}
//                       className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2"
//                     >
//                       <div className="flex items-center gap-2">
//                         <Avatar className="w-6 h-6">
//                           <AvatarFallback className="text-xs">
//                             {getInitials(comment.by?.name)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <span className="text-sm font-medium text-gray-900">
//                           {comment.by?.name || "Unknown"}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-700 pl-8">
//                         {comment.text}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-sm text-gray-500">
//                   No comments yet
//                 </div>
//               )}

//               {editable && (
//                 <>
//                   <Separator className="my-4" />
//                   <AddCommentForm
//                     taskId={task._id}
//                     onCommentAdded={() => onTaskUpdated?.(task)}
//                   />
//                 </>
//               )}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, User } from "lucide-react";
import ProgressForm from "@/components/task/ProgressForm";
import AddCommentForm from "@/components/task/AddCommentForm";
import { apiFetch } from "@/utils/api";

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

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Tested/Done";
      case "in progress":
        return "In Progress";
      case "pending":
        return "Not started";
      default:
        return status;
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
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const currentProgress = task.progressFields?.length
    ? task.progressFields[task.progressFields.length - 1].value
    : "0%";

  // Calculate time/days (mock for now - you can implement actual logic)
  const calculateTime = () => {
    if (!task.startDate || !task.endDate) return "0";
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };

  return (
    <div className="w-full">
      {/* Header Info */}
      {/* <div className="mb-4 space-y-3">
        <div className="flex items-start justify-between">
          {/* <div>
            <h2 className="text-2xl font-bold text-gray-900">{task.desc}</h2>
            {task.assignedBy && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Assigned by</span>
                <Avatar className="w-5 h-5">
                  <AvatarImage src={task.assignedBy.avatarUrl} />
                  <AvatarFallback className="text-xs">
                    {getInitials(task.assignedBy.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">
                  {task.assignedBy.name}
                </span>
              </div>
            )}
          </div> 
          <Badge
            variant="outline"
            className={`${getStatusColor(task.status)} px-3 py-1`}
          >
            {getStatusLabel(task.status)}
          </Badge>
        </div>
      </div> */}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12 font-semibold">No.</TableHead>
              <TableHead className="w-32 font-semibold">Assigned To</TableHead>
              <TableHead className="w-32 font-semibold">Assigned By</TableHead>
              <TableHead className="w-40 font-semibold">
                Topic / Context
              </TableHead>
              <TableHead className="font-semibold">Task</TableHead>
              <TableHead className="w-32 font-semibold">Status</TableHead>
              <TableHead className="w-24 font-semibold">Time</TableHead>
              <TableHead className="w-28 font-semibold">Start date</TableHead>
              <TableHead className="w-28 font-semibold">Due on</TableHead>
              <TableHead className="w-32 font-semibold">Completed On</TableHead>
              <TableHead className="w-40 font-semibold">
                Remarks / Comment
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-gray-50">
              {/* Task Number */}
              <TableCell className="font-medium">1</TableCell>

              {/* Assigned To */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {task.assignedTo.length > 0 && (
                    <>
                      <Avatar className="w-6 h-6">
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
                <div className="flex items-center gap-2">
                  {task.assignedBy && (
                    <>
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={task.assignedBy.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {getInitials(
                            task.assignedBy ? task.assignedBy.name : undefined
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {task.assignedBy ? task.assignedBy.name : "—"}
                      </span>
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

              {/* Time */}
              <TableCell className="text-sm text-gray-600">
                {calculateTime()}
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
                        <div className="space-y-2 max-h-64 overflow-y-auto">
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
                            const res = await apiFetch(`/tasks/${task._id}`);
                            if (res.ok && onTaskUpdated) {
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
          </TableBody>
        </Table>
      </div>

      {/* Progress Section - Below Table */}
      {editable && (
        <div className="mt-6 p-6 bg-white border rounded-lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Update Progress
            </h3>
            <p className="text-sm text-gray-500">
              Current progress: {currentProgress}
            </p>
          </div>
          <ProgressForm
            taskId={task._id}
            progressValue={currentProgress}
            onProgressUpdated={(updated?: { _id?: string }) => {
              if (!onTaskUpdated) return;
              const id = updated?._id ?? task._id;
              void (async () => {
                const res = await apiFetch(`/tasks/${id}`);
                if (res.ok) {
                  const full = await res.json();
                  onTaskUpdated(full);
                }
              })();
            }}
          />
        </div>
      )}

      {/* Read-only Progress Display */}
      {/* {!editable && (
        <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Current Progress
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {currentProgress}
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
