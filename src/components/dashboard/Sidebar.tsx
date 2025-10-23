// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { apiFetch } from "@/utils/api";
// import { FaHashtag, FaUserCircle } from "react-icons/fa";

// type Team = { _id: string; name: string; members: { _id: string; name: string }[] };
// type User = { name: string; avatarUrl?: string };

// export default function Sidebar() {
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     apiFetch("/teams").then(res => res.ok ? res.json() : []).then(setTeams);
//     apiFetch("/me").then(res => res.ok ? res.json() : null).then(setUser);
//   }, []);

//   return (
//     <aside className="w-72 min-h-screen bg-gradient-to-br from-[#232042] via-[#3d1a51] to-[#7b2ff2] shadow-xl flex flex-col text-white">
//       {/* Workspace header */}
//       <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
//         <div className="w-9 h-9 bg-purple-700 rounded-full flex items-center justify-center text-xl font-bold">
//           {user?.name ? user.name[0] : "S"}
//         </div>
//         <span className="font-bold text-lg tracking-wide">Shelfexecution</span>
//         <button className="ml-auto text-white/50 text-xl">⋮</button>
//       </div>
//       <nav className="flex-1 overflow-y-auto px-4 py-4">
//         <div className="mb-2 text-xs text-gray-300 uppercase">Teams</div>
//         {teams.map(team => (
//           <Link
//             key={team._id}
//             href={`/teams/${team._id}`}
//             className="flex items-center px-3 py-2 rounded cursor-pointer mb-1 hover:bg-purple-900 transition"
//           >
//             <FaHashtag className="mr-2 text-purple-300" />
//             <span className="font-semibold">{team.name}</span>
//             <span className="ml-auto text-xs text-purple-200">{team.members.length}</span>
//           </Link>
//         ))}
//         {teams.length === 0 && (
//           <div className="text-xs text-gray-400 px-3 py-2">No teams yet</div>
//         )}
//         <div className="mt-6 mb-2 text-xs text-gray-300 uppercase">Direct Messages</div>
//         <Link href="#" className="flex items-center px-3 py-2 rounded cursor-pointer hover:bg-purple-900 mb-1">
//           <FaUserCircle className="mr-2 text-lg" />
//           <span>Demo User</span>
//         </Link>
//       </nav>
//       <div className="px-4 py-3 border-t border-white/10 text-xs text-gray-300">
//         <Link href="/teams/create" className="hover:text-yellow-300">
//           ➕ New Team
//         </Link>
//       </div>
//       <div className="px-4 mb-6 mt-auto">
//         <Link href="/profile" className="flex items-center gap-2 text-pink-200 hover:text-white transition">
//           <FaUserCircle className="text-lg" />
//           Profile
//         </Link>
//       </div>
//     </aside>
//   );
// }

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { Users, Plus, Settings, UsersRound, MessageCircle, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Team, User } from "@/types/type";

export default function Sidebar() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    apiFetch("/teams")
      .then((res) => (res.ok ? res.json() : []))
      .then(setTeams)
      .catch(() => setTeams([]));

    apiFetch("/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const isActiveTeam = (teamId: string) => pathname.includes(`/teams/${teamId}`);

  return (
    <aside className="w-64 min-h-screen bg-gray-900 flex flex-col border-r border-gray-800 shadow-lg">
      {/* Workspace Header */}
      <div className="px-2 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 flex-1 group">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <span className="text-lg font-bold text-white">
                {user?.name ? getInitials(user.name) : "S"}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-white text-base">Shelfexecution</h2>
              <p className="text-xs text-gray-300">Workspace</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-8">
        {/* Teams Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Teams
            </span>
            <Link href="/teams/create">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-1">
            {teams.map((team) => (
              <Link
                key={team._id}
                href={`/teams/${team._id}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition group ${
                  isActiveTeam(team._id)
                    ? "bg-gray-800 text-white shadow-sm"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div
                  className={`p-1.5 rounded-md ${
                    isActiveTeam(team._id)
                      ? "bg-purple-700/20 text-purple-500"
                      : "bg-gray-800 text-gray-400 group-hover:bg-purple-900/10 group-hover:text-purple-400"
                  }`}
                >
                  <UsersRound className="w-4 h-4" />
                </div>
                <span className="flex-1 font-medium text-sm truncate">
                  {team.name}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-800 text-gray-300 text-xs px-1 py-0.5 border-0"
                >
                  {team.members.length}
                </Badge>
                <ChevronRight className={`w-4 h-4 transition ${
                  isActiveTeam(team._id) ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                }`} />
              </Link>
            ))}

            {teams.length === 0 && (
              <div className="px-3 py-8 text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-xs text-gray-400 mb-3">No teams yet</p>
                <Link href="/teams/create">
                  <Button
                    size="sm"
                    className="bg-purple-700 hover:bg-purple-600 text-white"
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Create Team
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Direct Messages Section */}
        <div className="space-y-2">
          <div className="px-2 mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Direct Messages
            </span>
          </div>
          <Link
            href="/messages"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition group"
          >
            <Avatar className="w-8 h-8 border-2 border-gray-800">
              <AvatarFallback className="bg-gray-800 text-gray-400 text-xs">
                DU
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 font-medium text-sm">Demo User</span>
            <MessageCircle className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition" />
          </Link>
        </div>
      </nav>

      {/* Bottom User Profile */}
      <div className="border-t border-gray-800 p-4">
        <Link href="/profile">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition group cursor-pointer">
            <Avatar className="w-9 h-9 border-2 border-gray-800 ring-2 ring-purple-700 ring-offset-2 ring-offset-gray-900">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-purple-700 to-blue-700 text-white text-sm font-semibold">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400">View Profile</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition" />
          </div>
        </Link>
      </div>
    </aside>
  );
}