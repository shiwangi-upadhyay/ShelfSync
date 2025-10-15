import { FaPlus } from "react-icons/fa";
import Link from "next/link";
type Member = {
  _id: string;
  name: string;
};

type Team = {
  _id: string;
  name: string;
  admin: {
    _id: string;
  };
  members: Member[];
};

type User = {
  _id: string;
};

interface TeamPanelHeaderProps {
  team: Team;
  me: User;
}

export default function TeamPanelHeader({ team, me }: TeamPanelHeaderProps) {
  const isAdmin = team.admin._id === me._id;
  return (
    <div className="header">
      <div>{team.name}</div>
      <div>
        {team.members.map(m => <span key={m._id}>{m.name[0]}</span>)}
        <span>{team.members.length} members</span>
        {isAdmin && <Link href={`/teams/${team._id}/create-task`}><FaPlus /></Link>}
      </div>
    </div>
  );
}