import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import Image from "next/image";
// You may need these icons: react-icons/fa, react-icons/md, etc.

type User = { _id: string; name: string; avatarUrl?: string };
type Task = {
  _id: string;
  desc: string;
  status: string;
  priority: string;
  startDate?: string;
  endDate?: string;
  progressFields: { title: string; value: string }[];
  comments: { text: string; by: User; createdAt: string }[];
  files?: { name: string; url: string; type: string }[];
};
type Team = {
  _id: string;
  name: string;
  admin: User;
  members: User[];
};

export default function TeamPanel({ teamId }: { teamId: string }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const teamRes = await apiFetch(`/teams/${teamId}`);
      if (teamRes.ok) setTeam(await teamRes.json());
      const tasksRes = await apiFetch(`/tasks/team/${teamId}`);
      if (tasksRes.ok) setTasks(await tasksRes.json());
      setLoading(false);
    }
    fetchData();
  }, [teamId]);

  if (loading)
    return (
      <div className="text-center py-20 text-lg text-purple-300">
        Loading...
      </div>
    );
  if (!team) return <div>Team not found.</div>;

  return (
    <div className="flex flex-col h-full bg-[#222328] px-0">
      {/* Topbar */}
      <div className="flex items-center px-8 py-4 border-b border-[#333]">
        <span className="font-bold text-xl text-white">{team.name}</span>
        <div className="ml-4 flex gap-2">
          {["Messages", "Add canvas", "Files", "Pins"].map((tab) => (
            <button
              key={tab}
              className="text-sm text-gray-400 px-3 py-1 rounded hover:bg-[#2b2d31]"
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {team.members.map((m) => (
            <Image
              key={m._id}
              src={m.avatarUrl || "/avatar.png"}
              alt={m.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border-2 border-purple-700"
            />
          ))}
        </div>
      </div>

      {/* Main content: Task/chat panel */}
      <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
        {/* TASKS OVERVIEW */}
        <div className="mb-6">
          <h3 className="text-lg text-purple-200 mb-2 font-bold">
            Tasks & Progress
          </h3>
          <div className="flex flex-wrap gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`bg-[#25272b] rounded-lg p-4 w-80 shadow cursor-pointer border ${
                  selectedTask === task._id
                    ? "border-purple-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedTask(task._id)}
              >
                <div className="font-semibold text-white">{task.desc}</div>
                <div className="text-xs text-gray-400 mb-1">
                  Status:{" "}
                  <span className="font-bold text-blue-300">{task.status}</span>{" "}
                  | Priority: <span className="font-bold">{task.priority}</span>
                </div>
                <div className="text-xs text-gray-400">
                  Start:{" "}
                  {task.startDate
                    ? new Date(task.startDate).toLocaleDateString()
                    : "—"}{" "}
                  | End:{" "}
                  {task.endDate
                    ? new Date(task.endDate).toLocaleDateString()
                    : "—"}
                </div>
                <div className="mt-2">
                  <span className="text-sm text-purple-300 font-medium">
                    Progress:
                  </span>
                  <ul className="ml-2">
                    {(task.progressFields || []).map((pf, i) => (
                      <li key={i} className="text-xs text-gray-300">
                        {pf.title}:{" "}
                        <span className="font-bold text-white">{pf.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {Array.isArray(task.files) && task.files.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-green-300">Files:</span>
                    {task.files.map((f) => (
                      <a
                        key={f.url}
                        href={f.url}
                        target="_blank"
                        className="block text-xs text-blue-300 underline mt-1"
                      >
                        {f.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CHAT/COMMENTS PANEL */}
        <div className="bg-[#23242a] rounded-lg p-6 flex flex-col gap-3 w-full max-w-3xl mx-auto shadow-lg">
          <h3 className="text-lg font-bold text-purple-300 mb-1">
            Task Conversation
          </h3>
          {selectedTask ? (
            <>
              <div className="overflow-y-auto max-h-96 flex flex-col gap-4">
                {tasks
                  .find((t) => t._id === selectedTask)
                  ?.comments.map((comment, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Image
                        src={comment.by?.avatarUrl || "/avatar.png"}
                        alt={comment.by?.name || "avatar"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-purple-700"
                      />
                      <div>
                        <span className="font-semibold text-white">
                          {comment.by?.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleTimeString()}
                        </span>
                        <div className="text-gray-200">{comment.text}</div>
                      </div>
                    </div>
                  ))}
              </div>
              <form
                className="flex items-center gap-3 mt-4 border-t border-[#333] pt-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Call backend to add comment
                  await apiFetch(`/tasks/${selectedTask}/comment`, {
                    method: "POST",
                    body: JSON.stringify({ text: newComment }),
                    headers: { "Content-Type": "application/json" },
                  });
                  setNewComment("");
                  // Optionally refresh the comments list
                }}
              >
                <input
                  className="flex-1 bg-[#292b31] text-white px-3 py-2 rounded"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Message #task"
                />
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-4 py-2 rounded font-bold"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="text-gray-400">
              Select a task to view chat/comments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
