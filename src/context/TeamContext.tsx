"use client";
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

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

export const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [user, setUser] = useState<User | null>(null);
  return (
    <TeamContext.Provider value={{ team, setTeam, user, setUser }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}