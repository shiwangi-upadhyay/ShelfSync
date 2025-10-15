"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import TeamForm from "@/components/team/TeamForm";

type Team = {
  _id: string;
  name: string;
  admin: { _id: string; name: string };
  members: { _id: string; name: string }[];
};

export default function TeamEditPage() {
  const { teamId } = useParams();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      const res = await apiFetch(`/teams/${teamId}`);
      if (res.ok) setTeam(await res.json());
      setLoading(false);
    }
    fetchTeam();
  }, [teamId]);

  if (loading || !currentUser) return <div>Loading...</div>;
  if (!team) return <div>Team not found.</div>;
  console.log("team.admin._id", team.admin._id);
  console.log("currentUser._id", currentUser._id);
  if (team.admin._id !== currentUser._id) {
    return <div>Forbidden: Only the team admin can edit this team.</div>;
  }

  async function handleUpdateTeam(data: { name: string; memberIds: string[] }) {
    if (!team) {
      alert("Team not found.");
      return;
    }
    // Debug log for outgoing payload
    console.log("[TeamEditPage] Updating team with data:", data);

    const res = await apiFetch(`/teams/${team._id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      router.push(`/teams/${team._id}`);
    } else {
      // Debug log for failure
      const error = await res.text();
      console.log("[TeamEditPage] Team update failed:", error);
      alert("Failed to update team.");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Team</h1>
      <TeamForm
        onSubmit={handleUpdateTeam}
        initialName={team.name}
        initialMembers={team.members}
      />
    </div>
  );
}