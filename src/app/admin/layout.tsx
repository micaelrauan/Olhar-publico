import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Users,
  FileText,
  BookmarkCheck,
  Bot,
  Database,
  LogOut,
} from "lucide-react";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/admin", label: "Visão geral", icon: BarChart3 },
  { href: "/admin/politicos", label: "Políticos", icon: Users },
  { href: "/admin/fontes", label: "Fontes", icon: Database },
  { href: "/admin/publicacoes", label: "Publicações", icon: FileText },
  { href: "/admin/revisao", label: "Revisão editorial", icon: BookmarkCheck },
  { href: "/admin/agentes", label: "Agentes", icon: Bot },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || !["ADMIN", "EDITOR"].includes(session.user.role ?? "")) {
    redirect("/admin/login");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)] min-h-[calc(100vh-76px)]">
      {/* Sidebar */}
      <aside className="border-b md:border-b-0 md:border-r border-border bg-card p-6 flex flex-col justify-between">
        <div>
          <div className="mb-6 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Painel Editorial
            </span>
            <div className="text-sm font-semibold truncate mt-1">
              {session.user.name || session.user.email}
            </div>
            <span className="text-xs text-muted-foreground">{session.user.role}</span>
          </div>

          <Separator className="mb-4" />

          <nav className="space-y-1" aria-label="Administração">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6">
          <Separator className="mb-4" />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="p-6 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
