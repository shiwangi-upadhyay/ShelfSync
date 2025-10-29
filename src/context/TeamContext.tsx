"use client";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useMemo,
} from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type Team = {
  _id: string;
  name: string;
  admin: User;
  members: User[];
};

type TeamContextType = {
  team: Team | null;
  setTeam: Dispatch<SetStateAction<Team | null>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Memoize the entire context value so it only changes when team or user actually change.
  const value = useMemo(() => ({ team, setTeam, user, setUser }), [team, user]);

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used inside TeamProvider");
  return ctx;
}
export default TeamContext;
