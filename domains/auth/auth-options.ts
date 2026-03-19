import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { createAuditLog } from "@/domains/audit/service";
import { prisma } from "@/lib/db/prisma";

const googleClientId =
  process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? process.env.GOOGLE_ID ?? "";
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET ??
  process.env.GOOGLE_CLIENT_SECRET ??
  process.env.GOOGLE_SECRET ??
  "";

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
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
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
