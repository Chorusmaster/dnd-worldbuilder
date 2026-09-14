import ListTab from "@/components/list-tab";

export default async function QuestsTab() {
  return (
    <ListTab 
      entities={[]} 
      page="quests" 
      entityType="quest" 
    />
  );
}
