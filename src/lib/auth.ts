import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";

if (!process.env.DISCORD_CLIENT_ID) {
  throw new Error('Missing DISCORD_CLIENT_ID');
}

if (!process.env.DISCORD_CLIENT_SECRET) {
  throw new Error('Missing DISCORD_CLIENT_SECRET');
}

if (!process.env.NEXTAUTH_URL) {
  throw new Error('Missing NEXTAUTH_URL');
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET');
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: profile.email!,
              name: profile.name || profile.email!.split('@')[0],
              password: '', // No password needed for Discord users
            },
          });
        }
      }
      return true; 
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 