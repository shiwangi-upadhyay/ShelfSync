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
  // Consider dashboard as root or create team page
  const isDashboard = pathname === "/" || pathname === "/teams/create";

  return (
    <div className="flex min-h-screen bg-gray-50"> {/* bg-background -> bg-gray-50 */}
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar
          memberAvatars={team ? team.members.map((m: User) => m.avatarUrl || "") : []}
          memberCount={team ? team.members.length : 0}
          showTabs={!isDashboard}
        />
        <main className="flex-1 overflow-y-auto bg-white"> {/* bg-background -> bg-white */}
          <div className="max-w-7xl mx-auto py-8 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}