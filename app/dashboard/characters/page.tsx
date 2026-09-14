"use client";

import { useEffect, useState } from "react";

import ListTab from "@/components/list-tab";
import { useDashboard } from "@/app/dashboard/dashboard-context";
import { getCharactersByWorldAction } from "@/features/character/character.actions";
import type { PublicCharacterRecord } from "@/features/character/character.repository";

export default function CharactersTab() {
  const { activeWorld } = useDashboard();
  const [entities, setEntities] = useState<PublicCharacterRecord[]>([]);
  const [loadedWorldId, setLoadedWorldId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!activeWorld) {
      return () => {
        cancelled = true;
      };
    }

    getCharactersByWorldAction(activeWorld._id).then((characters) => {
      if (!cancelled) {
        setLoadedWorldId(activeWorld._id);
        setEntities(characters);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeWorld]);

  const displayedEntities = activeWorld?._id === loadedWorldId ? entities : [];

  return (
    <ListTab
      page="characters"
      entityType="character"
    />
  );
}
