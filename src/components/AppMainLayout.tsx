"use client";
import MainLayout from "@/components/dashboard/MainLayout";
import { usePathname } from "next/navigation";

export default function AppMainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  return isAuthPage ? children : <MainLayout>{children}</MainLayout>;
}

