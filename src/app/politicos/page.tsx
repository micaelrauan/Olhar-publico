import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listPoliticiansPage } from "@/domain/politicians/repository";
import { politicianFilters } from "@/domain/politicians/schemas";

export const metadata: Metadata = { title: "Diretório de políticos" };

export default async function Politicians({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const parsed = politicianFilters.safeParse(Object.fromEntries(Object.entries(raw).filter(([, value]) => typeof value === "string")));
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

  return <main className="container">
    <div className="page-intro"><h1 className="page-title">Diretório de políticos</h1><p>Consulte deputados federais com dados obtidos diretamente da Câmara dos Deputados. Outras casas legislativas serão incorporadas por fonte.</p></div>
    <form className="filters" action="/politicos"><input name="q" aria-label="Nome" placeholder="Nome" className="input" defaultValue={filters.q} /><input name="party" aria-label="Partido" placeholder="Partido" className="input" defaultValue={filters.party} /><input name="office" aria-label="Cargo" placeholder="Deputado federal" className="input" defaultValue={filters.office} /><input name="state" aria-label="Estado" placeholder="UF" maxLength={2} className="input" defaultValue={filters.state} /><button type="submit" className="button">Filtrar</button></form>
    {result?.provider === "camara" && <p className="small muted">Fonte: <a className="text-link" href={result.sourceUrl} target="_blank" rel="noreferrer">Dados Abertos da Câmara dos Deputados ↗</a> · Página {currentPage} · Consulta realizada em {new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(new Date())}</p>}
    {result?.provider === "demo" && <p className="demo-label">Dados fictícios de demonstração</p>}
    {!result && <p role="alert" className="source-alert">A API pública está temporariamente indisponível. Tente novamente em alguns minutos.</p>}
    {result && <><div className="directory-list" style={{ marginTop: 18 }}>{people.map((p) => <Link href={`/politicos/${p.slug}`} className="directory-row" key={p.slug}><span><span className="row-title">{p.name}</span>{p.isDemo && <span className="demo-label" style={{ marginLeft: 12 }}>Demonstração</span>}</span><span className="secondary">{p.office}</span><span className="secondary muted">{p.party} · {p.state}</span><ArrowRight size={20} /></Link>)}</div>{people.length === 0 && <p className="muted" style={{ padding: "35px 0" }}>Nenhum perfil encontrado com esses filtros.</p>}<nav className="pagination" aria-label="Páginas do diretório">{currentPage > 1 && <Link className="button button-outline" href={pageHref(currentPage - 1)}>Página anterior</Link>}{result.hasNext && <Link className="button button-outline" href={pageHref(currentPage + 1)}>Próxima página <ArrowRight size={16} /></Link>}</nav></>}
  </main>;
}
