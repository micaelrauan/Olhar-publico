import { auth } from "@/auth";

export async function requireEditor() {
  const session = await auth();
  return session?.user?.role === "EDITOR" || session?.user?.role === "ADMIN" ? session : null;
}
