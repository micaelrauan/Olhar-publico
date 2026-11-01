import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [Credentials({
    credentials: { email: {}, password: {} },
    async authorize(credentials) {
      const result = z.object({ email: z.email(), password: z.string().min(1) }).safeParse(credentials);
      if (!result.success || !process.env.DATABASE_URL) return null;
      const user = await prisma.adminUser.findUnique({ where: { email: result.data.email.toLowerCase() } });
      if (!user || !(await compare(result.data.password, user.passwordHash))) return null;
      return { id: user.id, name: user.name, email: user.email, role: user.role };
    },
  })],
  callbacks: {
    jwt({ token, user }) { if (user) token.role = user.role; return token; },
    session({ session, token }) { session.user.role = token.role as "ADMIN" | "EDITOR"; return session; },
  },
});
