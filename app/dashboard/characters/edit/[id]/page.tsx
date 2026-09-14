import CharacterEditor from "@/features/character/ui/character-editor";

type CharacterEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CharacterEditPage({
  params,
}: CharacterEditPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <CharacterEditor characterId={id} />
    </main>
  );
}
