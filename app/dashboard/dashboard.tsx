"use client";

import MainSidebar from "@/components/main-sidebar";
import type { PublicUserRecord } from "@/features/auth/auth.repository";
import type { PublicWorldRecord } from "@/features/world/world.repository";
import { createWorldAction } from "@/features/world/world.actions";
import WorldDialog from "./world-dialog";
import { useEffect, useState } from "react";
import { useDashboard } from "./dashboard-context";
import { deleteWorldAction } from "@/features/world/world.actions";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";

type DashboardProps = {
  user: PublicUserRecord;
  initialWorlds: PublicWorldRecord[];
  children: React.ReactNode;
};

export default function Dashboard({
  user,
  initialWorlds,
  children,
}: DashboardProps) {
  const [worlds, setWorlds] = useState(initialWorlds);
  const dashboardContext = useDashboard();

  useEffect(() => {
    if (!dashboardContext.activeWorld && worlds[0]) {
      dashboardContext.setActiveWorld(worlds[0]);
    }
  }, [worlds]);

  const createWorld = async (formData: FormData) => {
    const result = await createWorldAction(formData);

    if (result.success) {
      setWorlds((old) => [...old, result.result]);
      dashboardContext.setActiveWorld(result.result);
      return null;
    }

    return {
      name: result.errors.name?.[0],
      description: result.errors.description?.[0],
      general: result.errors.general?.[0],
    };
  };

  const deleteWorld = async (id: string) => {
    await deleteWorldAction(id);

    const remainingWorlds = worlds.filter((world) => world._id !== id);

    if (dashboardContext.activeWorld?._id === id) {
      dashboardContext.setActiveWorld(remainingWorlds[0] ?? null);
    }

    setWorlds((old) => old.filter((world) => world._id !== id));
  };

  return (
    <div className="flex h-full">
      <MainSidebar user={user} worlds={worlds} deleteWorld={deleteWorld} />

      <main className="flex-1 bg-background flex justify-center items-center px-16 pt-8 pb-8">
        {children}
      </main>

      <WorldDialog createWorld={createWorld} />
    </div>
  );
}
