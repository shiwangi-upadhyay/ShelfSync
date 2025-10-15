"use client";
import TeamForm from "./TeamForm";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function CreateTeamPage() {
  const router = useRouter();

  // Accepts correct data from TeamForm
  async function handleCreateTeam(data: { name: string; memberIds: string[] }) {
    // Rename memberIds to members for backend API
    const payload = {
      name: data.name,
      memberIds: data.memberIds,
    };
    console.log("Creating team with payload:", payload); // debug log
    const res = await apiFetch("/teams", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to create team");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Team</h1>
      <TeamForm onSubmit={handleCreateTeam} />
    </div>
  );
}
