import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { updateUserSettings } from "@/domains/user-settings/actions";
import { authOptions } from "@/domains/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      email: true,
      name: true,
      settings: {
        select: {
          displayName: true,
          theme: true,
          timezone: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Account Settings</h1>
      <p className="mt-2 text-sm text-slate-600">Manage your profile and preferences.</p>

      <dl className="mt-6 grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <div>
          <dt className="font-medium">Email</dt>
          <dd>{user.email ?? "No email"}</dd>
        </div>
        <div>
          <dt className="font-medium">Name</dt>
          <dd>{user.name ?? "No name"}</dd>
        </div>
      </dl>

      <form action={updateUserSettings} className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="displayName" className="text-sm font-medium text-slate-900">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            maxLength={80}
            defaultValue={user.settings?.displayName ?? ""}
            className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:ring"
            placeholder="How others should see your name"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="timezone" className="text-sm font-medium text-slate-900">
            Timezone
          </label>
          <input
            id="timezone"
            name="timezone"
            type="text"
            maxLength={64}
            defaultValue={user.settings?.timezone ?? "UTC"}
            className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:ring"
            placeholder="UTC"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="theme" className="text-sm font-medium text-slate-900">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            defaultValue={user.settings?.theme ?? "SYSTEM"}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-300 focus:ring"
          >
            <option value="SYSTEM">System</option>
            <option value="LIGHT">Light</option>
            <option value="DARK">Dark</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Save settings
          </button>
        </div>
      </form>
    </section>
  );
}
