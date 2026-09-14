import ListTab from "@/components/list-tab";

export default async function LocationsTab() {
  return (
    <ListTab 
      entities={[]} 
      page="locations" 
      entityType="location" 
    />
  );
}
