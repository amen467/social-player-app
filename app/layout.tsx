import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { authOptions } from "@/domains/auth/auth-options";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Player",
  description: "Foundation slice for Social Player",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
              <Link href="/" className="text-sm font-semibold tracking-wide text-slate-900">
                Social Player
              </Link>

              <nav className="flex items-center gap-3">
                {session?.user?.id ? (
                  <>
                    <Link
                      href="/account/settings"
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Settings
                    </Link>
                    <SignOutButton />
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
