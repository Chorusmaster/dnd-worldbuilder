import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/features/auth/auth.actions";

export default async function Home() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div>
      <form action={logoutAction}>
        <button className="cursor-pointer hover:text-primary" type="submit">Logout</button>
      </form>
    </div>
  );
}
