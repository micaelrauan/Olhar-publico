import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listPoliticiansPage } from "@/domain/politicians/repository";
import { politicianFilters } from "@/domain/politicians/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Diretório de políticos" };

export default async function Politicians({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = politicianFilters.safeParse(
    Object.fromEntries(
      Object.entries(raw).filter(([, value]) => typeof value === "string")
    )
  );
  const filters = parsed.success ? parsed.data : {};
  const result = await listPoliticiansPage(filters).catch(() => null);
  const people = result?.items ?? [];
  const currentPage = filters.pagina ?? 1;

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.party) params.set("party", filters.party);
    if (filters.office) params.set("office", filters.office);
    if (filters.state) params.set("state", filters.state);
    params.set("pagina", String(page));
    return `/politicos?${params}`;
  };

  return (
    <main className="container">
      {/* Intro */}
      <div className="py-16 pb-9">
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-tight m-0 mb-4">
          Diretório de políticos
        </h1>
        <p className="text-muted-foreground text-[1.08rem] leading-relaxed max-w-[700px]">
          Consulte deputados federais com dados obtidos diretamente da Câmara
          dos Deputados. Outras casas legislativas serão incorporadas por fonte.
        </p>
      </div>

      {/* Filters */}
      <form
        className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2.5 mb-7"
        action="/politicos"
      >
        <Input
          name="q"
          aria-label="Nome"
          placeholder="Nome"
          defaultValue={filters.q}
          className="col-span-2 md:col-span-1"
        />
        <Input name="party" aria-label="Partido" placeholder="Partido" defaultValue={filters.party} />
        <Input name="office" aria-label="Cargo" placeholder="Deputado federal" defaultValue={filters.office} />
        <Input name="state" aria-label="Estado" placeholder="UF" maxLength={2} defaultValue={filters.state} />
        <Button type="submit" className="col-span-2 md:col-span-1">
          Filtrar
        </Button>
      </form>

      {/* Source info */}
      {result?.provider === "camara" && (
        <p className="source-note mb-4">
          Fonte:{" "}
          <a
            className="text-link"
            href={result.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Dados Abertos da Câmara dos Deputados ↗
          </a>{" "}
          · Página {currentPage} · Consulta realizada em{" "}
          {new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
          }).format(new Date())}
        </p>
      )}

      {result?.provider === "demo" && (
        <Badge variant="demo" className="mb-4">
          Dados fictícios de demonstração
        </Badge>
      )}

      {!result && (
        <Alert variant="info" className="mb-6">
          <AlertDescription>
            A API pública está temporariamente indisponível. Tente novamente em
            alguns minutos.
          </AlertDescription>
        </Alert>
      )}

      {/* Directory */}
      {result && (
        <>
          <div className="border-t border-border mt-4">
            {people.map((p) => (
              <Link
                href={`/politicos/${p.slug}`}
                className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 items-center py-5 border-b border-border no-underline group"
                key={p.slug}
              >
                <span>
                  <span className="font-serif text-[1.35rem] font-bold group-hover:text-primary transition-colors">
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

          {people.length === 0 && (
            <p className="text-muted-foreground py-9">
              Nenhum perfil encontrado com esses filtros.
            </p>
          )}

          {/* Pagination */}
          <nav
            className="flex gap-2.5 justify-end mt-7"
            aria-label="Páginas do diretório"
          >
            {currentPage > 1 && (
              <Button variant="outline" asChild>
                <Link href={pageHref(currentPage - 1)}>Página anterior</Link>
              </Button>
            )}
            {result.hasNext && (
              <Button variant="outline" asChild>
                <Link href={pageHref(currentPage + 1)}>
                  Próxima página <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </nav>
        </>
      )}
    </main>
  );
}
