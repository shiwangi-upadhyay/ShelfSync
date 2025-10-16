"use client";
import TeamForm from "./TeamForm";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateTeamPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  async function handleCreateTeam(data: { name: string; memberIds: string[] }) {
    setError("");
    
    
    const payload = {
      name: data.name,
      memberIds: data.memberIds,
    };
    
    console.log("Creating team with payload:", payload);
    
    try {
      const res = await apiFetch("/teams", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create team. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } 
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl shadow-lg mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Create a New Team
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Bring your team together and start collaborating on tasks and projects
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-in slide-in-from-top-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Form Card */}
        <Card className="shadow-xl border-gray-200">
          <CardHeader className="space-y-2 border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-gray-700" />
              Team Details
            </CardTitle>
            <CardDescription className="text-gray-600">
              Set up your team with a name and invite members to collaborate
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <TeamForm onSubmit={handleCreateTeam} />
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">
                  What happens next?
                </h3>
                <p className="text-sm text-gray-600">
                  Once you create your team, you'll be able to assign tasks, track progress, 
                  and collaborate with your team members in real-time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}