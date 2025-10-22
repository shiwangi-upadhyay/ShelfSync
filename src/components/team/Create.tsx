"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Sparkles, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MemberAutocomplete from "@/components/team/MemberAutocomplete";

export default function CreateTeamPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [members, setMembers] = useState<
    { _id: string; name: string; canCreateTask: boolean }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleAddMember(user: { _id: string; name: string }) {
    if (!members.some((m) => m._id === user._id)) {
      setMembers([...members, { ...user, canCreateTask: false }]);
    }
  }

  function handleRemoveMember(userId: string) {
    setMembers(members.filter((m) => m._id !== userId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = {
      name, // <--- this must be a non-empty string!
      members: members.map((m) => ({
        user: m._id,
        canCreateTask: m.canCreateTask,
      })),
    };

    try {
      const res = await apiFetch("/teams", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create team. Please try again.");
      }
    } catch (err) {
      console.error("Error creating team:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="space-y-6">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-900 -ml-2 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
                Create a New Team
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Build your dream team and start collaborating on projects
                together
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="animate-fade-in border-red-400 bg-red-100"
          >
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form Card */}
        <Card className="shadow-lg border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-violet-600" />

          <CardHeader className="space-y-3 border-b border-gray-200 bg-gray-50 pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
              Team Details
            </CardTitle>
            <CardDescription className="text-base text-gray-500">
              Give your team a memorable name and invite your collaborators
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Team Name */}
              <div className="space-y-3">
                <Label
                  htmlFor="team-name"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  Team Name
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="team-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Marketing Team, Engineering Squad"
                  className="h-12 text-base border-gray-200 focus:border-violet-600 bg-white"
                  required
                />
              </div>

              {/* Members Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Team Members
                    {members.length > 0 && (
                      <Badge variant="outline" className="ml-2">
                        {members.length}{" "}
                        {members.length === 1 ? "member" : "members"}
                      </Badge>
                    )}
                  </Label>
                </div>

                <MemberAutocomplete onAdd={handleAddMember} />

                {/* Members List */}
                {members.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-violet-600" />
                      Added Members
                    </div>
                    <div className="grid gap-3">
                      {members.map((member, idx) => (
                        <div
                          key={member._id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-100 hover:bg-gray-200 transition group"
                        >
                          <Avatar className="w-10 h-10 border-2 border-violet-100">
                            <AvatarFallback className="bg-violet-600 text-white text-sm font-semibold">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 font-medium">
                            {member.name}
                          </span>
                          <label className="flex items-center gap-1 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={member.canCreateTask}
                              onChange={() => {
                                setMembers((members) =>
                                  members.map((m, i) =>
                                    i === idx
                                      ? {
                                          ...m,
                                          canCreateTask: !m.canCreateTask,
                                        }
                                      : m
                                  )
                                );
                              }}
                            />
                            Can create tasks
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex-1 h-12 text-base"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-base bg-violet-600 hover:bg-violet-700 transition text-white shadow-lg"
                  disabled={isSubmitting || !name.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Create Team
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
