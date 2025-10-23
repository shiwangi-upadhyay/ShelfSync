"use client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ReactNode } from "react";
import { Team, User, TabType } from "@/types/type";
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
}: MainLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/" || pathname === "/teams/create";

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar: fixed left, full height */}
      <div className="fixed left-0 top-0 h-screen w-64 z-30 bg-gray-50 border-r border-gray-200">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col ml-64 h-screen">
        {/* Topbar: sticky/fixed at top */}
        <div className="fixed top-0 left-64 right-0 z-20">
          <Topbar
            memberAvatars={team ? team.members.map((m: User) => m.avatarUrl || "") : []}
            memberCount={team ? team.members.length : 0}
            showTabs={!isDashboard}
          />
        </div>
        {/* Main Content: scrollable */}
        <main className="flex-1 overflow-y-auto bg-white pt-[112px]"> {/* pt-[64px] = Topbar height */}
          <div className="max-w-7xl mx-auto py-8 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}