import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPolitician } from "@/domain/politicians/repository";
import { ExpenseChart } from "@/components/expense-chart";
import { SourceReference } from "@/components/source-reference";
import { brl, dateBR } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const politician = await getPolitician((await params).slug).catch(() => null);
  return { title: politician?.name ?? "Perfil de político" };
}

export default async function Profile({ params }: { params: Promise<{ slug: string }> }) {
  const politician = await getPolitician((await params).slug);
  if (!politician) notFound();
  const p = politician;
  const byCategory = new Map<string, number>();
  for (const expense of p.expenses) byCategory.set(expense.description, (byCategory.get(expense.description) ?? 0) + Number(expense.amount));
  const chart = [...byCategory].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));

  return <main>
    <div className="profile-head"><div className="container">{p.isDemo && <span className="demo-label">Perfil fictício · demonstração</span>}<h1>{p.name}</h1><p className="muted">{p.office} · {p.party} · {p.state}</p><p style={{ maxWidth: 650, lineHeight: 1.6 }}>{p.biography}</p>{p.sourceUrl && <p className="source-note">Perfil: <a className="text-link" href={p.sourceUrl} target="_blank" rel="noreferrer">Dados Abertos da Câmara dos Deputados ↗</a></p>}</div></div>
    <div className="container profile-layout"><div className="profile-main">
      <section><h2>Gastos públicos</h2><p className="muted small">{p.isDemo ? "Valores fictícios de demonstração." : "Até 50 registros recentes da Cota para Exercício da Atividade Parlamentar, conforme resposta da Câmara. O gráfico agrupa apenas os registros exibidos."}</p>{chart.length > 0 && <ExpenseChart data={chart} />}{p.expenses.map((expense) => <div className="data-row" key={expense.id}><div><b>{expense.description}</b><div className="small muted">{expense.context}</div><div className="source-note">{dateBR(expense.occurredAt)} · <SourceReference source={expense.source} /></div></div><strong>{brl(Number(expense.amount))}</strong></div>)}{p.expensesUnavailable && <p className="source-alert">As despesas não puderam ser consultadas agora. Confira diretamente a fonte oficial.</p>}{!p.expenses.length && !p.expensesUnavailable && <p className="muted">A fonte consultada não retornou despesas nesta consulta. Isso não comprova ausência de gastos.</p>}{p.sourceUrl && <p className="source-note"><a className="text-link" href={`${p.sourceUrl}/despesas`} target="_blank" rel="noreferrer">Abrir consulta de despesas na Câmara ↗</a></p>}</section>
      <section><h2>Emendas</h2>{p.amendments.map((amendment) => <div className="data-row" key={amendment.id}><div><b>{amendment.destination}</b><div className="small muted">{amendment.context}</div><div className="source-note">{amendment.year} · <SourceReference source={amendment.source} /></div></div><strong>{brl(Number(amendment.amount))}</strong></div>)}{!p.amendments.length && <p className="muted">Ainda não há dados de emendas vinculados a este perfil nesta fonte.</p>}</section>
      <section><h2>Declarações e checagens</h2>{p.statements.map((statement) => <div key={statement.id}><blockquote className="serif" style={{ fontSize: "1.45rem", marginLeft: 0 }}>“{statement.quote}”</blockquote><p className="small muted">{statement.context} {statement.factCheck && `Checagem: ${statement.factCheck}`}</p><div className="source-note">{dateBR(statement.saidAt)} · <SourceReference source={statement.source} /></div></div>)}{!p.statements.length && <p className="muted">Nenhuma declaração foi revisada editorialmente para este perfil.</p>}</section>
      <section><h2>Processos e investigações</h2>{p.cases.map((legalCase) => <div className="data-row" key={legalCase.id}><div><b>{legalCase.title}</b><p>{legalCase.summary}</p>{legalCase.outcome && <p>{legalCase.outcome}</p>}<div className="source-note">Situação: {legalCase.status} · {dateBR(legalCase.occurredAt)} · <SourceReference source={legalCase.source} /></div></div></div>)}{!p.cases.length && <p className="muted">Não há processos revisados neste perfil. A ausência de registros aqui não indica ausência de processos em fontes oficiais.</p>}</section>
      <section><h2>Linha do tempo</h2>{p.events.map((event) => <div className="data-row" key={event.id}><div><b>{event.title}</b><div className="small muted">{event.description}</div><div className="source-note"><SourceReference source={event.source} /></div></div><time className="small">{dateBR(event.occurredAt)}</time></div>)}{p.eventsUnavailable && <p className="source-alert">O histórico parlamentar não pôde ser consultado agora.</p>}{!p.events.length && !p.eventsUnavailable && <p className="muted">A fonte consultada não retornou eventos para este perfil.</p>}</section>
    </div><aside className="profile-aside"><div className="search-box"><h3>Sobre as fontes</h3><p className="small muted" style={{ lineHeight: 1.6 }}>{p.isDemo ? "Este perfil é uma demonstração. Os registros ilustrativos não possuem documentos oficiais e não devem ser interpretados como informação sobre pessoas reais." : "Os dados de deputado e as despesas vêm da API oficial da Câmara. Consulte o documento vinculado a cada registro. Emendas, acusações e checagens só aparecem após vinculação e revisão adequadas."}</p></div></aside></div>
  </main>;
}
