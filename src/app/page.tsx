"use client";
import DashboardPage from "@/components/dashboard/page";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function Home() {

 

  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}