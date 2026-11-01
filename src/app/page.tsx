import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { listPoliticians } from "@/domain/politicians/repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const features = [
  {
    title: "Origem verificável",
    description: "Documentos, datas e responsáveis acompanham cada informação publicada.",
  },
  {
    title: "Estado dos fatos",
    description: "Alegações, investigações e decisões são apresentadas como situações distintas.",
  },
  {
    title: "Revisão humana",
    description: "Todo conteúdo editorial passa por análise antes de se tornar público.",
  },
];

export default async function Home() {
  const people = await listPoliticians()
    .then((items) => items.slice(0, 3))
    .catch(() => null);

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border py-20 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] gap-16 items-end">
            <div>
              <h1 className="font-serif text-[clamp(3rem,6.3vw,6rem)] font-bold leading-[1.04] tracking-[-0.035em] max-w-[760px] m-0 mb-7">
                O poder é público. A informação também.
              </h1>
              <p className="text-[1.16rem] leading-relaxed text-muted-foreground max-w-[590px] m-0">
                Dados, documentos e contexto para acompanhar a atuação de
                representantes políticos. Cada registro deve poder ser conferido
                na origem.
              </p>
            </div>

            {/* Search box */}
            <Card className="rounded-none border-border shadow-none">
              <CardHeader className="pb-4">
                <label
                  htmlFor="home-search"
                  className="text-xs font-extrabold uppercase tracking-widest"
                >
                  Encontre um político
                </label>
              </CardHeader>
              <CardContent className="pt-0">
                <form action="/politicos" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      id="home-search"
                      name="q"
                      placeholder="Pesquise pelo nome"
                      className="flex-1"
                    />
                    <Button type="submit">
                      <Search className="h-4 w-4" />
                      Pesquisar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {process.env.PUBLIC_DATA_SOURCE === "demo"
                      ? "Esta instalação está no modo de demonstração."
                      : "A consulta pública usa dados oficiais da Câmara dos Deputados."}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diretório */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-baseline gap-5 mb-7 pb-4 border-b border-border">
            <h2 className="font-serif text-[clamp(2.1rem,4vw,2.5rem)] tracking-[-0.03em] leading-tight m-0">
              Explore o diretório
            </h2>
            <Link
              className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
              href="/politicos"
            >
              Ver todos <ArrowRight className="h-4 w-4 inline" />
            </Link>
          </div>

          {people && (
            <div className="border-t border-border">
              {people.map((p) => (
                <Link
                  href={`/politicos/${p.slug}`}
                  className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 items-center py-5 border-b border-border no-underline group"
                  key={p.slug}
                >
                  <span>
                    <span className="font-serif text-xl font-bold group-hover:text-primary transition-colors">
                      {p.name}
                    </span>
                    {p.isDemo && (
                      <Badge variant="demo" className="ml-3">
                        Demonstração
                      </Badge>
                    )}
                  </span>
                  <span className="text-sm hidden md:block">{p.office}</span>
                  <span className="text-sm text-muted-foreground hidden md:block">
                    {p.party} · {p.state}
                  </span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          )}

          {!people && (
            <Alert variant="info">
              <AlertDescription>
                A consulta à Câmara está temporariamente indisponível. Você
                ainda pode tentar pesquisar pelo nome.
              </AlertDescription>
            </Alert>
          )}

          {process.env.PUBLIC_DATA_SOURCE !== "demo" && (
            <p className="source-note mt-4">
              Fonte oficial:{" "}
              <a
                className="text-link"
                href="https://dadosabertos.camara.leg.br/api/v2/deputados"
                target="_blank"
                rel="noreferrer"
              >
                Dados Abertos da Câmara dos Deputados ↗
              </a>
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container">
          <div className="flex justify-between items-baseline gap-5 mb-7 pb-4 border-b border-border">
            <h2 className="font-serif text-[clamp(2.1rem,4vw,2.5rem)] tracking-[-0.03em] leading-tight m-0">
              Informação com contexto
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-border">
            {features.map((f) => (
              <div
                key={f.title}
                className="py-6 pr-7 border-b border-border last-of-type:border-b-0 md:last-of-type:border-b"
              >
                <h3 className="font-serif text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm max-w-[32ch] m-0">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
