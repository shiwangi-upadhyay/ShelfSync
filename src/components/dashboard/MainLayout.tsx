"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ReactNode } from "react";
import { Team, User, TabType } from "../../types/type";
import DashboardPage from "./page";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
  team?: Team;
  user?: User;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  onCreateTask?: () => void;
}

export default function MainLayout({
  children,
  team,
  user,
  activeTab = "messages",
  onTabChange = () => {},
}: MainLayoutProps)

{
  const pathname = usePathname();
  // Adjust this to match your dashboard route(s)
  const isDashboard = pathname === "/dashboard" || pathname === "/teams/create";
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar
          memberAvatars={team ? team.members.map((m: User) => m.avatarUrl || "/avatar.png") : []}
          memberCount={team ? team.members.length : 0}
          showTabs={!isDashboard}
        />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}