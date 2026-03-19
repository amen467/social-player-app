import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SignInButton } from "@/components/auth/sign-in-button";
import { authOptions } from "@/domains/auth/auth-options";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/account/settings");
  }

  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" && params.callbackUrl.startsWith("/")
      ? params.callbackUrl
      : "/account/settings";

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">
        Use Google OAuth to create your account or continue with an existing one.
      </p>

      <div className="mt-6">
        <SignInButton callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}
