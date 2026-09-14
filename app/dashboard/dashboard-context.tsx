"use client";

import { PublicWorldRecord } from "@/features/world/world.repository";
import { getEntityTypesAction } from "@/features/entity/entity.actions";
import { PublicEntityTypeRecord } from "@/features/entity/entity.service";
import { createContext, useContext, useEffect, useState } from "react";

type DashboardContextValue = {
  createWorldOpen: boolean;
  setCreateWorldOpen: (value: boolean) => void;
  activeWorld: PublicWorldRecord | null;
  setActiveWorld: (value: PublicWorldRecord | null) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  entityTypes: PublicEntityTypeRecord[];
  setEntityTypes: React.Dispatch<
    React.SetStateAction<PublicEntityTypeRecord[]>
  >;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [createWorldOpen, setCreateWorldOpen] = useState(false);
  const [activeWorld, setActiveWorld] = useState<PublicWorldRecord | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [entityTypes, setEntityTypes] = useState<PublicEntityTypeRecord[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadEntityTypes() {
      if (!activeWorld) {
        setEntityTypes([]);
        return;
      }

      const loadedEntityTypes = await getEntityTypesAction(
        activeWorld._id.toString(),
      );

      if (!cancelled) {
        setEntityTypes(loadedEntityTypes);
      }
    }

    loadEntityTypes();

    return () => {
      cancelled = true;
    };
  }, [activeWorld]);

  return (
    <DashboardContext.Provider
      value={{
        createWorldOpen,
        setCreateWorldOpen,
        activeWorld,
        setActiveWorld,
        activeTab,
        setActiveTab,
        entityTypes,
        setEntityTypes,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
}
