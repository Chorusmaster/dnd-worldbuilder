import ListTab from "@/components/list-tab";

type EntitiesTabProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EntitiesTab({
  params,
}: EntitiesTabProps) {
  const { slug } = await params;

  return (
    <ListTab 
      page={slug}
    />
  );
}
