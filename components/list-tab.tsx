"use client";

import { useEffect, useState } from "react";
import { EntityCard } from "./ui/entity-card";
import { CreateEntityCard } from "./ui/new-entity-card";
import { CreateEntityDialog } from "@/features/entity/components/create-entity-dialog";

import { useRouter } from "next/navigation";
import { useDashboard } from "@/app/dashboard/dashboard-context";

import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

import { deleteEntityTypeAction } from "@/features/entity/entity.actions";
import { getEntitiesAction } from "@/features/entity/entity.actions";
import { entityIcons } from "@/features/entity/entity.icons";

type Entity = {
  _id: string;
  name: string;
  description?: string | null;
  image?: string | null;
};

type ListTabProps = {
  page: string;
  entityType?: string;
};

function ListTab({ page }: ListTabProps) {
  const entities: Entity[] = [];

  const router = useRouter();
  const dashboardContext = useDashboard();

  const [loadedEntities, setLoadedEntities] = useState(entities);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const entityType = dashboardContext.entityTypes.find(
    (entityType) => entityType.slug === page,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadEntities() {
      if (!dashboardContext.activeWorld || !entityType) {
        setLoadedEntities([]);
        return;
      }

      const worldEntities = await getEntitiesAction(
        dashboardContext.activeWorld._id,
      );

      if (!cancelled) {
        setLoadedEntities(
          worldEntities.filter((entity) => entity.typeId === entityType._id),
        );
      }
    }

    void loadEntities();

    return () => {
      cancelled = true;
    };
  }, [dashboardContext.activeWorld, entityType, page]);

  if (!entityType) return null;

  const upperCaseEntitiesName =
    entityType.name.at(0)?.toUpperCase() + entityType.name.slice(1);

  async function handleDeleteType() {
    if (!entityType) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${entityType.name}"?`,
    );

    if (!confirmed) return;

    const deletedId = entityType._id;

    await deleteEntityTypeAction(entityType._id);

    dashboardContext.setEntityTypes((prev) =>
      prev.filter((type) => type._id !== deletedId),
    );

    router.push(`/dashboard`);
    router.refresh();
  }

  function handleEditType() {
    router.push(`/dashboard/${page}/edit`);
  }

  return (
    <div className="w-full h-full">
      <div className="mb-8 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">{upperCaseEntitiesName} </h1>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDeleteType}>
            <Trash2 />
            Delete type
          </Button>

          <Button variant="outline" onClick={handleEditType}>
            <Pencil />
            Edit fields
          </Button>
        </div>
      </div>
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))] items-start gap-8">
        {loadedEntities.map((entity) => (
          <EntityCard
            key={entity._id}
            icon={entityIcons[entityType.icon as keyof typeof entityIcons]}
            name={entity.name}
            description={entity.description ?? undefined}
            image={entity.image ?? undefined}
            onClick={() => router.push(`/dashboard/${page}/${entity._id}`)}
          />
        ))}

        <CreateEntityCard
          key="new"
          icon={entityIcons[entityType.icon as keyof typeof entityIcons]}
          onClick={() => setIsCreateDialogOpen(true)}
        />
      </div>
      <CreateEntityDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        entityTypeId={entityType._id}
        entityTypeSlug={entityType.slug}
      />
    </div>
  );
}

export default ListTab;
