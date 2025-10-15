"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { 
  Calendar, 
  Clock, 
  Flag, 
  User, 
  FileText, 
  Tag,
  ChevronDown,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function CreateTaskPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<{ admin: any; members: any[] } | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const router = useRouter();

  useEffect(() => {
    async function fetchTeam() {
      const res = await apiFetch(`/teams/${teamId}`);
      if (res.ok) {
        const teamData = await res.json();
        setTeam(teamData);
        const initialTasks = teamData.members.map((m: any) => ({
          assignedTo: [m._id],
          desc: "",
          topic: "",
          subTopic: "",
          startDate: "",
          endDate: "",
          priority: "medium",
        }));
        setTasks(initialTasks);
        // Expand first task by default
        setExpandedTasks(new Set([0]));
      }
    }
    fetchTeam();
  }, [teamId]);

  function handleTaskChange(idx: number, field: string, value: string) {
    setTasks((tasks) =>
      tasks.map((task, i) => (i === idx ? { ...task, [field]: value } : task))
    );
  }

  function toggleExpanded(idx: number) {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  }

  function getPriorityIcon(priority: string) {
    switch (priority) {
      case "high": return <AlertCircle className="w-4 h-4" />;
      case "medium": return <Flag className="w-4 h-4" />;
      case "low": return <CheckCircle2 className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!team) return setError("Team not loaded");
    
    const userRes = await apiFetch("/me");
    const me = userRes.ok ? await userRes.json() : null;
    
    if (!me || team.admin._id !== me._id)
      return setError("Only the team creator can assign tasks.");
    
    const validTasks = tasks.filter(
      (t) => t.desc.trim() && t.assignedTo.length
    );
    
    if (validTasks.length === 0)
      return setError("Please fill at least one task.");
    
    const res = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ teamId, tasks: validTasks }),
      headers: { "Content-Type": "application/json" },
    });
    
    if (res.ok) {
      router.push(`/teams/${teamId}`);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create tasks");
    }
  }

  const filledTasks = tasks.filter(t => t.desc.trim()).length;
  const totalMembers = team?.members.length || 0;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">
          Create Tasks
        </h1>
        <p className="text-gray-500">
          Assign tasks to your team members
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Tasks filled: {filledTasks} / {totalMembers}
          </span>
          <span className="text-sm text-gray-500">
            {totalMembers > 0 ? Math.round((filledTasks / totalMembers) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${totalMembers > 0 ? (filledTasks / totalMembers) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Tasks Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {team &&
          tasks.map((task, idx) => {
            const member = team.members[idx];
            const isExpanded = expandedTasks.has(idx);
            const isFilled = task.desc.trim().length > 0;

            return (
              <div
                key={member._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
                style={{
                  animation: `slideIn 0.3s ease-out ${idx * 0.05}s backwards`
                }}
              >
                {/* Task Header - Collapsible */}
                <button
                  type="button"
                  onClick={() => toggleExpanded(idx)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isFilled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isFilled ? '✓' : idx + 1}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {member.name}
                        {isFilled && (
                          <span className="text-xs text-green-600 font-normal">
                            Task assigned
                          </span>
                        )}
                      </div>
                      {task.desc && !isExpanded && (
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {task.desc}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.priority && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Task Details - Expandable */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-100">
                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                        <FileText className="w-3.5 h-3.5" />
                        Task Description
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                        placeholder="What needs to be done?"
                        value={task.desc}
                        onChange={(e) => handleTaskChange(idx, "desc", e.target.value)}
                      />
                    </div>

                    {/* Topic & Subtopic */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                          <Tag className="w-3.5 h-3.5" />
                          Topic
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="Main topic"
                          value={task.topic}
                          onChange={(e) => handleTaskChange(idx, "topic", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                          <Tag className="w-3.5 h-3.5" />
                          Subtopic
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="Subtopic"
                          value={task.subTopic}
                          onChange={(e) => handleTaskChange(idx, "subTopic", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                          <Calendar className="w-3.5 h-3.5" />
                          Start Date
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                          type="date"
                          value={task.startDate}
                          onChange={(e) => handleTaskChange(idx, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                          <Clock className="w-3.5 h-3.5" />
                          End Date
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                          type="date"
                          value={task.endDate}
                          onChange={(e) => handleTaskChange(idx, "endDate", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                        <Flag className="w-3.5 h-3.5" />
                        Priority
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['low', 'medium', 'high'].map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => handleTaskChange(idx, "priority", priority)}
                            className={`px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm capitalize flex items-center justify-center gap-2 ${
                              task.priority === priority
                                ? `${getPriorityColor(priority)} border-current`
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {task.priority === priority && getPriorityIcon(priority)}
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* Submit Button */}
        <div className="sticky bottom-0 pt-6 pb-4 bg-white border-t border-gray-200 -mx-6 px-6">
          <button
            type="submit"
            disabled={filledTasks === 0}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Create {filledTasks} {filledTasks === 1 ? 'Task' : 'Tasks'}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}