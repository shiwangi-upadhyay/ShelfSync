import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Team = {
  _id: string;
  name: string;
  admin: { _id: string; name: string };
  members: { _id: string; name: string }[];
};

export default function TeamCard({ team }: { team: Team }) {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser && team.admin._id === currentUser._id;

  console.log("team.admin._id", team.admin._id);
  console.log("currentUser?._id", currentUser?._id);
  console.log("isAdmin", isAdmin);

  return (
    <div className="border rounded p-4 shadow">
      <div className="font-bold text-lg">{team.name}</div>
      <div className="text-sm text-muted-foreground">Admin: {team.admin.name}</div>
      <div className="mt-2 flex gap-2">
        <Link href={`/teams/${team._id}`}>
          <Button variant="outline">View</Button>
        </Link>
        {isAdmin && (
          <Link href={`/teams/${team._id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        )}
      </div>
    </div>
  );
}