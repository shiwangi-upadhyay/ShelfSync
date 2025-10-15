"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import TeamCard from "@/components/team/TeamCard";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/dashboard/MainLayout";

type Team = {
  _id: string;
  name: string;
  admin: { _id: string; name: string };
  members: { _id: string; name: string }[];
};

export default function DashboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      const res = await apiFetch("/teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
      setLoading(false);
    }
    fetchTeams();
  }, []);

  if (loading) return <MainLayout><div className="text-center text-xl text-purple-300">Loading...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-300">Your Teams</h1>
          <Link href="/teams/create">
            <Button className="bg-purple-700 text-white shadow-lg hover:scale-105 transition">
              + Create Team
            </Button>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map(team => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}