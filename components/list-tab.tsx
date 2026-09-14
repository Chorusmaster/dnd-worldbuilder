"use client";
import { EntityCard } from "./ui/entity-card";
import { CreateEntityCard } from "./ui/new-entity-card";
import { useRouter } from "next/navigation";

type Entity = {
  _id: string;
  name: string;
  description?: string | null;
  image?: string | null;
};

type ListTabProps = {
  entities: Entity[];
  page: string;
  entityType?: string;
};

function ListTab({ entities, page, entityType }: ListTabProps) {
  const router = useRouter();

  return (
    <div className="w-full h-full">
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8 items-start">
        {entities.map((entity) => (
          <EntityCard
            key={entity._id}
            name={entity.name}
            description={entity.description ?? undefined}
            image={entity.image ?? undefined}
            onClick={() => router.push(`dashboard/${page}/${entity._id}`)}
          />
        ))}
        <CreateEntityCard
          key={"new"}
          entityType={entityType}
          onClick={() => router.push(`/dashboard/${page}/new`)}
        />
      </div>
    </div>
  );
}

export default ListTab;
