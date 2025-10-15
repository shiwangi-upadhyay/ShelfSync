// "use client";
// import Link from "next/link";
// import { FaSearch, FaCog, FaPlus } from "react-icons/fa";
// import {
//   ChevronDown,
//   Lock,
//   MessageCircle,
//   FileText,
//   Pin,
//   FileQuestion,
//   Plus,
//   Headphones,
// } from "lucide-react";
// import { useTeam } from "@/context/TeamContext";
// import { useTab } from "@/context/TabContext";
// import { TabType } from "../../types/type";
// // Tab type for stricter props

// // interface TopbarProps {
// //   workspace?: string;
// //   memberAvatars?: string[];
// //   memberCount?: number;
// //   activeTab?: TabType;
// //   onTabChange?: (tab: TabType) => void;
// // }

// export default function Topbar({
//   workspace = "ShelfSync",
//   memberAvatars = [],
//   memberCount = 0,
// }: {
//   workspace?: string;
//   memberAvatars?: string[];
//   memberCount?: number;
// }) {
//   const { team, user } = useTeam() ?? {};
//   const { activeTab, setActiveTab } = useTab();
//   const isAdmin = team && user && team.admin._id === user._id;

//   return (
//     <div className="bg-[#1a1d21] text-white">
//       {/* Top Bar */}
//       <div className="h-20 flex items-center justify-between px-3 border-b border-[#2f3136]">
//         {/* Left - Workspace */}
//         <div className="flex items-center">
//           <button className="flex items-center gap-1.5 hover:bg-white/5 px-2 py-1 rounded transition-colors">
//             <Lock className="w-3.5 h-3.5 text-gray-300" />
//             <span className="font-bold text-base">{workspace}</span>
//             <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
//           </button>
//         </div>

//         {/* Right - Icons */}
//         <div className="flex items-center gap-1">
//           <button className="p-2 hover:bg-white/5 rounded transition-colors">
//             <FaSearch className="w-4 h-4 text-gray-300" />
//           </button>

//           {/* Member Avatars - Moved to top right */}
//           {team && memberAvatars.length > 0 && (
//             <div className="flex items-center gap-1.5 px-2">
//               <div className="flex -space-x-1.5">
//                 {memberAvatars.slice(0, 3).map((url: string, idx: number) => (
//                   <img
//                     key={idx}
//                     src={url}
//                     alt="avatar"
//                     className="w-6 h-6 rounded border-2 border-[#1a1d21] hover:border-white/20 transition-colors cursor-pointer"
//                   />
//                 ))}
//               </div>
//               {memberCount > 0 && (
//                 <span className="text-xs text-gray-400 font-medium">
//                   {memberCount}
//                 </span>
//               )}
//             </div>
//           )}

//           <button className="p-1.5 hover:bg-white/5 rounded transition-colors">
//             <div className="w-5 h-5 bg-[#611f69] rounded text-white text-xs font-bold flex items-center justify-center">
//               D
//             </div>
//           </button>
//           <button className="px-2 py-1 hover:bg-white/5 rounded transition-colors">
//             <span className="text-sm font-semibold text-gray-300">8</span>
//           </button>
//           <button className="p-2 hover:bg-white/5 rounded transition-colors">
//             <Headphones className="w-4 h-4 text-gray-300" />
//           </button>
//           <button className="flex items-center gap-1 hover:bg-white/5 px-1.5 py-1 rounded transition-colors">
//             {/* <img
//               src={user?.avatarUrl || "/avatar.png"}
//               alt=""
//               className="w-6 h-6 rounded"
//             /> */}
//             <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
//           </button>
//           <button className="p-2 hover:bg-white/5 rounded transition-colors">
//             <div className="flex flex-col gap-0.5 items-center">
//               <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
//               <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
//               <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Bottom Bar - Tabs Section */}
//       <div className="h-20 flex items-center px-3">
//         {/* Main Navigation Tabs */}
//         {/* Messages Tab */}
//         <nav className="flex items-center gap-1">
//           {/* Messages Tab */}
//           <button
//             className={`flex items-center gap-2 px-3 py-1 text-sm font-medium transition-all relative ${
//               activeTab === "messages"
//                 ? "text-white"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveTab("messages")}
//           >
//             <MessageCircle className="w-4 h-4" />
//             <span>Messages</span>
//             {activeTab === "messages" && (
//               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t"></div>
//             )}
//           </button>
//           {/* Tasks Tab */}
//           <button
//             className={`flex items-center gap-2 px-3 py-1 text-sm font-medium transition-all relative ${
//               activeTab === "tasks"
//                 ? "text-white"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveTab("tasks")}
//           >
//             <FileText className="w-4 h-4" />
//             <span>Tasks</span>
//             {activeTab === "tasks" && (
//               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t"></div>
//             )}
//           </button>
//           {/* All Tasks Tab */}
//           <button
//             className={`flex items-center gap-2 px-3 py-1 text-sm font-medium transition-all relative ${
//               activeTab === "all"
//                 ? "text-white"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveTab("all")}
//           >
//             <Pin className="w-4 h-4" />
//             <span>All Tasks</span>
//             {activeTab === "all" && (
//               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t"></div>
//             )}
//           </button>
//           {/* Plus (Create Task) Button */}
//           {isAdmin && team && (
//             <Link
//               href={`/teams/${team._id}/task/create`}
//               className={`p-1.5 ml-1 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-white ${
//                 activeTab === "create" ? "bg-white/10" : ""
//               }`}
//               title="Create Task"
//               onClick={() => setActiveTab("create")}
//             >
//               <Plus className="w-4 h-4" />
//             </Link>
//           )}
//         </nav>

//         {/* Team Info - if team exists */}
//         {team && (
//           <div className="flex items-center gap-2 text-sm text-gray-400 ml-auto">
//             <span className="font-medium text-gray-300">{team.name}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { Search, Bell, Settings, ChevronDown, Plus, MessageCircle, FileText, Pin } from "lucide-react";
import { useTeam } from "@/context/TeamContext";
import { useTab } from "@/context/TabContext";
import { TabType } from "../../types/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Topbar({
  workspace = "ShelfSync",
  memberAvatars = [],
  memberCount = 0,
}: {
  workspace?: string;
  memberAvatars?: string[];
  memberCount?: number;
}) {
  const { team, user } = useTeam() ?? {};
  const { activeTab, setActiveTab } = useTab();
  const isAdmin = team && user && team.admin._id === user._id;

  const getInitials = (index: number) => {
    return `M${index + 1}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Top Section */}
      <div className="h-16 flex items-center justify-between px-6">
        {/* Left - Workspace & Search */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">
              {team?.name || workspace}
            </h1>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white h-9 text-sm"
            />
          </div>
        </div>

        {/* Right - Members & Actions */}
        <div className="flex items-center gap-3">
          {/* Member Avatars */}
          {team && memberAvatars.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {memberAvatars.slice(0, 4).map((url: string, idx: number) => (
                  <Avatar key={idx} className="w-8 h-8 border-2 border-white shadow-sm">
                    <AvatarImage src={url} />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                      {getInitials(idx)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {memberCount > 4 && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  +{memberCount - 4}
                </Badge>
              )}
            </div>
          )}

          <Separator orientation="vertical" className="h-6" />

          {/* Action Buttons */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bell className="w-4 h-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Avatar className="w-8 h-8 border border-gray-200 cursor-pointer hover:border-gray-300">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-gray-900 text-white text-xs">
              {user?.name ? user.name[0] : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Bottom Section - Tabs */}
      <div className="h-12 flex items-center px-6 bg-gray-50 border-t border-gray-200">
        <nav className="flex items-center gap-1">
          {/* Messages Tab */}
          <Button
            variant="ghost"
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-4 h-9 rounded-md transition-all ${
              activeTab === "messages"
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Messages</span>
          </Button>

          {/* Tasks Tab */}
          <Button
            variant="ghost"
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 h-9 rounded-md transition-all ${
              activeTab === "tasks"
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Tasks</span>
          </Button>

          {/* All Tasks Tab */}
          <Button
            variant="ghost"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-4 h-9 rounded-md transition-all ${
              activeTab === "all"
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <Pin className="w-4 h-4" />
            <span className="text-sm">All Tasks</span>
          </Button>

          {/* Create Task Button */}
          {isAdmin && team && (
            <>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Link href={`/teams/${team._id}/task/create`}>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("create")}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white h-9 px-4"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Create Task</span>
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}