import { getCurrentUserId } from "@/lib/auth";
import { getUserById } from "@/features/auth/auth.service";
import { getUserWorldsAction } from "@/features/world/world.actions";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
import { DashboardProvider } from "./dashboard-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await getUserById(userId);

  if (!user) {
    redirect("/login");
  }

  const worlds = await getUserWorldsAction(userId);

  return (
    <DashboardProvider>
      <Dashboard user={user} initialWorlds={worlds}>
        {children}
      </Dashboard>
    </DashboardProvider>
  );
}