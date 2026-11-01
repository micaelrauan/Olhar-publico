import type { Metadata } from "next";
import { demoNews } from "@/lib/demo";
import { prisma } from "@/lib/prisma";
import { dateBR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Notícias" };

type PublishedArticle = {
  id: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: Date | null;
  sources: { source: { id: string; title: string; url: string } }[];
};

export default async function News() {
  const published: PublishedArticle[] = process.env.DATABASE_URL
    ? await prisma.publication
        .findMany({
          where: { status: "PUBLISHED" },
          include: { sources: { include: { source: true } } },
          orderBy: { publishedAt: "desc" },
          take: 30,
        })
        .catch(() => [])
    : [];

  const demo = process.env.PUBLIC_DATA_SOURCE === "demo" && !process.env.DATABASE_URL;

  return (
    <main className="container py-12 md:py-16">
      <div className="pb-8">
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-tight m-0 mb-3">
          Notícias e análises
        </h1>
        <p className="text-muted-foreground text-[1.1rem] leading-relaxed max-w-[700px]">
          Conteúdo editorial com contexto, documentos de origem e histórico de revisão.
        </p>
      </div>

      <Separator className="mb-8" />

      <div className="space-y-10">
        {published.map((n) => (
          <article key={n.id} className="pb-8 border-b border-border space-y-3">
            <h2 className="font-serif text-2xl md:text-3xl font-bold">{n.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{n.summary}</p>
            <div className="prose text-foreground" style={{ whiteSpace: "pre-wrap" }}>
              {n.body}
            </div>
            {n.sources.length > 0 && (
              <p className="text-sm">
                Fontes:{" "}
                {n.sources.map(({ source }) => (
                  <a
                    key={source.id}
                    className="text-link mr-2"
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {source.title} ↗
                  </a>
                ))}
              </p>
            )}
            {n.publishedAt && (
              <span className="block text-xs text-muted-foreground">
                Publicado em {dateBR(n.publishedAt)}
              </span>
            )}
          </article>
        ))}

        {demo &&
          demoNews.map((n) => (
            <article key={n.slug} className="pb-8 border-b border-border space-y-2">
              <Badge variant="demo">{n.category} · demonstração</Badge>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">{n.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{n.summary}</p>
              <span className="block text-xs text-muted-foreground">
                {dateBR(n.date)}
              </span>
            </article>
          ))}

        {!published.length && !demo && (
          <p className="text-muted-foreground py-8">
            Ainda não há publicações revisadas. O diretório de deputados já usa dados oficiais da Câmara.
          </p>
        )}
      </div>
    </main>
  );
}
