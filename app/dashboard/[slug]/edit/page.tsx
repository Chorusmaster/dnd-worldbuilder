import EntityTypeEditView from "./entity-type-edit-view";

type EditEntityTypePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditEntityTypePage({
  params,
}: EditEntityTypePageProps) {
  const { slug } = await params;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Edit scheme
        </h1>

        <p className="text-muted-foreground mt-1">
          Define the fields and layout used by entities of this type.
        </p>
      </div>

      <EntityTypeEditView slug={slug} />
    </div>
  );
}