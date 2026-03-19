"use client";

import { useTransition } from "react";
import { signIn } from "next-auth/react";

type SignInButtonProps = {
  callbackUrl: string;
};

export function SignInButton({ callbackUrl }: SignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          void signIn("github", { callbackUrl });
        });
      }}
    >
      {isPending ? "Redirecting..." : "Continue with GitHub"}
    </button>
  );
}
