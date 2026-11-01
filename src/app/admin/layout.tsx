import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || !["ADMIN", "EDITOR"].includes(session.user.role ?? "")) redirect("/admin/login");
  return <div className="admin-shell"><nav className="admin-nav" aria-label="Administração"><Link href="/admin">Visão geral</Link><Link href="/admin/politicos">Políticos</Link><Link href="/admin/fontes">Fontes</Link><Link href="/admin/publicacoes">Publicações</Link><Link href="/admin/revisao">Revisão editorial</Link><Link href="/admin/agentes">Agentes</Link><form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}><button type="submit" className="small" style={{ padding: "11px 12px", cursor: "pointer" }}>Sair</button></form></nav><div className="admin-content">{children}</div></div>;
}
