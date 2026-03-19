import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { createAuditLog } from "@/domains/audit/service";
import { prisma } from "@/lib/db/prisma";

const githubClientId = process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID ?? "";
const githubClientSecret =
  process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      await createAuditLog({
        action: "SIGN_IN",
        userId: user.id,
        metadata: {
          provider: account?.provider ?? null,
          isNewUser,
        },
      });
    },
    async signOut({ session, token }) {
      const userId = session?.user?.id ?? token?.sub ?? null;

      await createAuditLog({
        action: "SIGN_OUT",
        userId,
      });
    },
  },
};
