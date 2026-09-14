import ListTab from "@/components/list-tab";

export default async function EventsTab() {
  return (
    <ListTab 
      entities={[]} 
      page="events" 
      entityType="event" 
    />
  );
}
