"use client";
import React, { createContext, useContext, useState } from "react";
type TabType = "messages" | "tasks" | "all" | "create";
const TabContext = createContext<{
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}>({ activeTab: "messages", setActiveTab: () => {} });

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>("messages");
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}
export function useTab() {
  return useContext(TabContext);
}