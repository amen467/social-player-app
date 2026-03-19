"use server";

import { ThemePreference } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { createAuditLog } from "@/domains/audit/service";
import { authOptions } from "@/domains/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

const allowedThemes = new Set<ThemePreference>([
  ThemePreference.SYSTEM,
  ThemePreference.LIGHT,
  ThemePreference.DARK,
]);

function parseTheme(rawValue: FormDataEntryValue | null): ThemePreference {
  const value = typeof rawValue === "string" ? rawValue.toUpperCase() : "SYSTEM";

  if (allowedThemes.has(value as ThemePreference)) {
    return value as ThemePreference;
  }

  return ThemePreference.SYSTEM;
}

export async function updateUserSettings(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const displayNameInput = String(formData.get("displayName") ?? "").trim();
  const timezoneInput = String(formData.get("timezone") ?? "UTC").trim();

  const displayName = displayNameInput.length > 0 ? displayNameInput.slice(0, 80) : null;
  const timezone = timezoneInput.length > 0 ? timezoneInput.slice(0, 64) : "UTC";
  const theme = parseTheme(formData.get("theme"));

  await prisma.userSettings.upsert({
    where: {
      userId: session.user.id,
    },
    create: {
      userId: session.user.id,
      displayName,
      timezone,
      theme,
    },
    update: {
      displayName,
      timezone,
      theme,
    },
  });

  await createAuditLog({
    action: "UPDATE_SETTINGS",
    userId: session.user.id,
    metadata: {
      theme,
      timezone,
    },
  });

  revalidatePath("/account/settings");
}
