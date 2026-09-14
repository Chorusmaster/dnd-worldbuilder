"use client"
import Image from "next/image";
import { Image as ImageIcon, LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type EntityCardProps = {
  name: string;
  description?: string;
  icon?: LucideIcon;
  image?: string;
  onClick?: () => void;
};

export function EntityCard({
  name,
  description,
  icon: Icon,
  image,
  onClick,
}: EntityCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-colors hover:bg-muted/50 pt-0!"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={640}
            height={360}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
            {Icon ? <Icon size={48} strokeWidth={1.5} /> : <ImageIcon size={48} strokeWidth={1.5} />}
          </div>
        )}
      </div>

      <CardContent className="px-4">
        <h3 className="truncate font-medium">
          {name}
        </h3>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}