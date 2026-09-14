import ListTab from "@/components/list-tab";

export default async function NotesTab() {
  return (
    <ListTab 
      entities={[]} 
      page="notes" 
      entityType="note" 
    />
  );
}
