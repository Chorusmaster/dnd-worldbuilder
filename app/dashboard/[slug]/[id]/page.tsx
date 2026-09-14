import { EntityViewer } from "@/features/entity/components/entity-viewer";
import {
  getEntityByIdAction,
  getEntityTypeByIdAction,
} from "@/features/entity/entity.actions";

type EntityViewPageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function EntityViewPage({ params }: EntityViewPageProps) {
  const { slug, id } = await params;
  const entity = await getEntityByIdAction(id);
  const entityType = await getEntityTypeByIdAction(entity.typeId);
  const fields = entityType.cards.flatMap((card) => card.fields);

  return <EntityViewer initialEntity={entity} fields={fields} slug={slug} />;
}
