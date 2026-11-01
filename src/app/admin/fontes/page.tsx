import { prisma } from "@/lib/prisma";
import { CreateSource } from "@/components/admin/create-source";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

type SourceItem = {
  id: string;
  title: string;
  url: string;
  publisher?: string;
  createdAt?: Date;
};

export default async function Sources() {
  const sources: SourceItem[] = process.env.DATABASE_URL
    ? await prisma.source
        .findMany({
          orderBy: { createdAt: "desc" },
          take: 30,
        })
        .catch(() => [])
    : [];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          Fontes
        </h1>
        <p className="text-muted-foreground mt-1">
          Cada publicação precisa ter pelo menos uma fonte documental vinculada.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fontes cadastradas</CardTitle>
          <CardDescription>
            Documentos oficiais e bases de dados abertos registrados.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-border">
            {sources.map((s: SourceItem) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
              >
                <b>{s.title}</b>
                <a
                  className="text-primary hover:underline text-sm font-semibold flex items-center gap-1"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir fonte <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
            {sources.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">
                Nenhuma fonte cadastrada no banco de dados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateSource />
    </div>
  );
}
