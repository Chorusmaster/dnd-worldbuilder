"use client";

import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type CreateEntityCardProps = {
  icon?: LucideIcon;
  onClick?: () => void;
};

export function CreateEntityCard({
  icon: Icon,
  onClick,
}: CreateEntityCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden pt-0! transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden bg-muted">
        <div className="flex size-full items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
          {Icon ? <Icon size={48} strokeWidth={1.5} /> : null}
        </div>
      </div>

      <CardContent className="flex items-center justify-center px-4">
        <Plus
          size={24}
          className="text-muted-foreground transition-colors group-hover:text-foreground"
        />
      </CardContent>
    </Card>
  );
}