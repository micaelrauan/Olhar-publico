import { prisma } from "@/lib/prisma";
import { ReviewAction } from "@/components/admin/review-action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PublicationWithSources = {
  id: string;
  title: string;
  summary: string;
  status: string;
  updatedAt: Date;
  sources: { source: { id: string; title: string } }[];
};

export default async function Review() {
  const publications: PublicationWithSources[] = process.env.DATABASE_URL
    ? await prisma.publication
        .findMany({
          where: { status: { not: "PUBLISHED" } },
          include: { sources: { include: { source: true } } },
          orderBy: { updatedAt: "desc" },
        })
        .catch(() => [])
    : [];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          Revisão editorial
        </h1>
        <p className="text-muted-foreground mt-1">
          Verifique texto, contexto e fontes antes de aprovar. O autor não pode publicar o próprio texto.
        </p>
      </div>

      <div className="space-y-6">
        {publications.map((p: PublicationWithSources) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{p.title}</CardTitle>
                <CardDescription className="mt-1">{p.summary}</CardDescription>
              </div>
              <Badge variant="demo">{p.status}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Fontes vinculadas:{" "}
                <span className="font-medium text-foreground">
                  {p.sources.map((s) => s.source.title).join(", ") || "nenhuma"}
                </span>
              </p>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <ReviewAction id={p.id} status={p.status} />
            </CardFooter>
          </Card>
        ))}

        {!publications.length && (
          <p className="text-muted-foreground py-8">
            Nenhuma publicação pendente de revisão.
          </p>
        )}
      </div>
    </div>
  );
}
