import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import type { User } from "@/types";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { db } = await connectToDatabase();

          // Check if user exists, if not create one
          const existingUser = await db.collection("users").findOne({
            userId: user.id,
          });

          if (!existingUser) {
            const newUser: Omit<User, "_id"> = {
              userId: user.id,
              email: user.email!,
              name: user.name!,
              image: user.image || undefined,
              totalStorageUsed: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            await db.collection("users").insertOne(newUser);
          }

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
