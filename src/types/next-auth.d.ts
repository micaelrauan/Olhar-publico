import "next-auth";
declare module "next-auth" {
  interface User { role?: "ADMIN" | "EDITOR" }
  interface Session { user: { role?: "ADMIN" | "EDITOR" } & DefaultSession["user"] }
}
declare module "next-auth/jwt" { interface JWT { role?: "ADMIN" | "EDITOR" } }
