import { prisma } from "@/lib/prisma";
import { CreatePolitician } from "@/components/admin/create-politician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type PoliticianItem = {
  id: string;
  name: string;
  office: string;
  state: string;
  party: string;
  slug: string;
};

export default async function AdminPoliticians() {
  const people: PoliticianItem[] = process.env.DATABASE_URL
    ? await prisma.politician
        .findMany({ orderBy: { name: "asc" } })
        .catch(() => [])
    : [];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          Políticos
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie perfis no banco de dados. Perfis fictícios do modo de demonstração não aparecem nesta lista.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Perfis no banco de dados</CardTitle>
          <CardDescription>
            {people.length} parlamentar(es) registrado(s) localmente.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-border">
            {people.map((p: PoliticianItem) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
              >
                <b>{p.name}</b>
                <span className="text-sm text-muted-foreground">
                  {p.office} · {p.party} · {p.state}
                </span>
              </div>
            ))}
            {people.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">
                Nenhum perfil cadastrado no banco de dados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreatePolitician />
    </div>
  );
}
