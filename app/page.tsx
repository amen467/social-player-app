import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/domains/auth/auth-options";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/account/settings");
  }

  redirect("/login");
}
