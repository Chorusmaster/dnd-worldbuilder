"use client";

import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type CreateEntityCardProps = {
  entityType?: string;
  onClick?: () => void;
};

export function CreateEntityCard({
  entityType,
  onClick,
}: CreateEntityCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden pt-0! transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        <div className="flex size-full items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
          <Plus size={32} />
        </div>
      </div>

      <CardContent className="px-4">
        <h3 className="font-medium transition-colors group-hover:text-foreground">
          Create new {entityType ?? "entity"}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a new {entityType ?? "entity"} to your world
        </p>
      </CardContent>
    </Card>
  );
}