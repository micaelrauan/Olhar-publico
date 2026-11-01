import { demoPoliticians, demoProfile } from "@/lib/demo";
import { prisma } from "@/lib/prisma";
import { CAMARA_API, CamaraApiError, getDeputy, getDeputyExpenses, getDeputyHistory, listDeputies } from "@/infrastructure/camara/client";
import type { PoliticianFilters } from "./schemas";

const mode = () => process.env.PUBLIC_DATA_SOURCE === "demo" ? "demo" : process.env.PUBLIC_DATA_SOURCE === "database" ? "database" : "camara";
const pageSize = 20;
const source = (url: string, accessedAt: string) => ({ title: "Dados Abertos da Câmara dos Deputados", publisher: "Câmara dos Deputados", url, accessedAt });

export async function listPoliticiansPage(filters: PoliticianFilters = {}) {
  const page = filters.pagina ?? 1;
  if (mode() === "demo") {
    const matches = demoPoliticians.filter((p) =>
      (!filters.q || p.name.toLocaleLowerCase("pt-BR").includes(filters.q.toLocaleLowerCase("pt-BR"))) &&
      (!filters.party || p.party === filters.party) && (!filters.office || p.office === filters.office) && (!filters.state || p.state === filters.state));
    return { items: matches.slice((page - 1) * pageSize, page * pageSize).map((p) => ({ ...p, sourceUrl: null as string | null })), hasNext: matches.length > page * pageSize, sourceUrl: null as string | null, provider: "demo" as const };
  }
  if (mode() === "database") {
    const people = await prisma.politician.findMany({
      where: { name: filters.q ? { contains: filters.q, mode: "insensitive" } : undefined, party: filters.party || undefined, office: filters.office || undefined, state: filters.state || undefined },
      orderBy: { name: "asc" }, skip: (page - 1) * pageSize, take: pageSize + 1,
    });
    return { items: people.slice(0, pageSize).map((p) => ({ ...p, sourceUrl: null as string | null })), hasNext: people.length > pageSize, sourceUrl: null as string | null, provider: "database" as const };
  }
  if (filters.office && !"deputado federal".includes(filters.office.toLocaleLowerCase("pt-BR"))) return { items: [], hasNext: false, sourceUrl: `${CAMARA_API}/deputados`, provider: "camara" as const };
  const result = await listDeputies({ q: filters.q, party: filters.party, state: filters.state, page });
  return {
    items: result.deputies.map((p) => ({ slug: `camara-${p.id}`, name: p.nome, party: p.siglaPartido ?? "Não informado", office: "Deputado federal", state: p.siglaUf ?? "—", biography: "Perfil da Câmara dos Deputados.", isDemo: false, sourceUrl: p.uri })),
    hasNext: result.hasNext, sourceUrl: result.sourceUrl, provider: "camara" as const,
  };
}

export async function listPoliticians(filters: PoliticianFilters = {}) { return (await listPoliticiansPage(filters)).items; }

export async function getPolitician(slug: string) {
  if (mode() === "demo") {
    const politician = demoPoliticians.find((p) => p.slug === slug);
    return politician ? { ...politician, ...demoProfile, sourceUrl: null, expensesUnavailable: false, eventsUnavailable: false } : null;
  }
  if (mode() === "database") {
    const politician = await prisma.politician.findUnique({ where: { slug }, include: { expenses: { include: { source: true }, orderBy: { occurredAt: "desc" } }, amendments: { include: { source: true } }, statements: { include: { source: true } }, cases: { include: { source: true } }, events: { include: { source: true }, orderBy: { occurredAt: "desc" } } } });
    return politician ? { ...politician, sourceUrl: null, expensesUnavailable: false, eventsUnavailable: false } : null;
  }
  const match = /^camara-(\d+)$/.exec(slug);
  if (!match) return null;
  const id = Number(match[1]);
  if (!Number.isSafeInteger(id)) return null;
  const detail = await getDeputy(id).catch((error: unknown) => { if (error instanceof CamaraApiError && error.status === 404) return null; throw error; });
  if (!detail) return null;
  const [expensesResult, historyResult] = await Promise.allSettled([getDeputyExpenses(id), getDeputyHistory(id)]);
  const accessedAt = new Date().toISOString();
  const status = detail.data.ultimoStatus;
  return {
    slug, name: status?.nome ?? detail.data.nomeCivil ?? `Deputado ${id}`,
    party: status?.siglaPartido ?? "Não informado", office: "Deputado federal", state: status?.siglaUf ?? "—",
    biography: status?.situacao ? `Situação informada pela Câmara: ${status.situacao}.` : "Dados do perfil oficial da Câmara dos Deputados.",
    isDemo: false, sourceUrl: detail.url,
    expenses: expensesResult.status === "fulfilled" ? expensesResult.value.data.filter((e) => e.dataDocumento && typeof e.valorLiquido === "number").map((e, index) => ({
      id: `${id}-${e.codDocumento ?? index}`, description: e.tipoDespesa ?? "Despesa parlamentar", amount: e.valorLiquido!, occurredAt: e.dataDocumento!,
      context: e.nomeFornecedor ? `Fornecedor informado: ${e.nomeFornecedor}. Valor líquido registrado pela Câmara.` : "Valor líquido registrado pela Câmara.",
      source: source(e.urlDocumento?.startsWith("https://") ? e.urlDocumento : expensesResult.value.url, accessedAt),
    })) : [],
    amendments: [],
    statements: [],
    cases: [],
    events: historyResult.status === "fulfilled" ? historyResult.value.data.filter((e) => e.dataHora).slice(0, 20).map((e, index) => ({
      id: `${id}-history-${index}`, title: e.descricaoStatus ?? "Mudança no histórico parlamentar", description: [e.situacao, e.siglaPartido, e.siglaUf].filter(Boolean).join(" · ") || "Registro no histórico da Câmara.", occurredAt: e.dataHora!, source: source(historyResult.value.url, accessedAt),
    })) : [],
    expensesUnavailable: expensesResult.status === "rejected", eventsUnavailable: historyResult.status === "rejected",
  };
}
