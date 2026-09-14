"use client";

import { PublicWorldRecord } from "@/features/world/world.repository";
import { createContext, useContext, useState } from "react";

type DashboardContextValue = {
  createWorldOpen: boolean;
  setCreateWorldOpen: (value: boolean) => void;
  activeWorld: PublicWorldRecord | null;
  setActiveWorld: (value: PublicWorldRecord | null) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [createWorldOpen, setCreateWorldOpen] = useState(false);
  const [activeWorld, setActiveWorld] = useState<PublicWorldRecord | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <DashboardContext.Provider
      value={{
        createWorldOpen,
        setCreateWorldOpen,
        activeWorld,
        setActiveWorld,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used within DashboardProvider"
    );
  }

  return context;
}