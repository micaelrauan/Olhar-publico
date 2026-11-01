import { prisma } from "@/lib/prisma";
import { CreatePublication } from "@/components/admin/create-publication";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PublicationItem = {
  id: string;
  title: string;
  status: string;
  updatedAt?: Date;
};

type SourceOption = {
  id: string;
  title: string;
};

export default async function Publications() {
  const [publications, sources] = process.env.DATABASE_URL
    ? await Promise.all([
        prisma.publication.findMany({ orderBy: { updatedAt: "desc" } }),
        prisma.source.findMany({ select: { id: true, title: true } }),
      ]).catch(() => [[], []] as [PublicationItem[], SourceOption[]])
    : [[], []] as [PublicationItem[], SourceOption[]];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          Publicações
        </h1>
        <p className="text-muted-foreground mt-1">
          Textos editoriais começam como rascunho e exigem revisão humana prévia.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Publicações cadastradas</CardTitle>
          <CardDescription>
            Histórico de artigos e status de revisão.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-border">
            {publications.map((p: PublicationItem) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
              >
                <b>{p.title}</b>
                <Badge
                  variant={
                    p.status === "PUBLISHED"
                      ? "default"
                      : p.status === "IN_REVIEW"
                      ? "demo"
                      : "secondary"
                  }
                >
                  {p.status}
                </Badge>
              </div>
            ))}
            {publications.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">
                Nenhuma publicação cadastrada no banco de dados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreatePublication sources={sources} />
    </div>
  );
}
