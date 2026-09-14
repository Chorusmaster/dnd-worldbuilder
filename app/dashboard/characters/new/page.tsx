import CharacterEditor from "@/features/character/ui/character-editor";

export default async function NewCharacterPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <CharacterEditor />
    </main>
  );
}
