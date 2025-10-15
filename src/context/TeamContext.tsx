"use client";
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";
import { ReactNode } from "react";

type TeamContextType = {
  team: any;
  setTeam: Dispatch<SetStateAction<any>>;
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
};

export const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState(null);
  const [user, setUser] = useState(null);
  return (
    <TeamContext.Provider value={{ team, setTeam, user, setUser }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}