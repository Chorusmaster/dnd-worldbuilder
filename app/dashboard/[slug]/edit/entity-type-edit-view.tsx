"use client";

import { EntityTypeEditor } from "@/features/entity/components/entity-type-editor";
import { useDashboard } from "../../dashboard-context";

type EntityTypeEditViewProps = {
  slug: string
};

export default function EntityTypeEditView({
  slug,
}: EntityTypeEditViewProps) {
  const dashboardContext = useDashboard();
  
  const entityType = dashboardContext.entityTypes.find((type) => type.slug === slug);

  if (!entityType) return null;

  return (
    <EntityTypeEditor entityType={entityType} />
  );
}