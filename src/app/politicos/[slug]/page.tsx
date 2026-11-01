import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPolitician } from "@/domain/politicians/repository";
import { ExpenseChart } from "@/components/expense-chart";
import { SourceReference } from "@/components/source-reference";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brl, dateBR } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const politician = await getPolitician((await params).slug).catch(() => null);
  return { title: politician?.name ?? "Perfil de político" };
}

export default async function Profile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const politician = await getPolitician((await params).slug);
  if (!politician) notFound();
  const p = politician;

  const byCategory = new Map<string, number>();
  for (const expense of p.expenses)
    byCategory.set(
      expense.description,
      (byCategory.get(expense.description) ?? 0) + Number(expense.amount)
    );
  const chart = [...byCategory]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  return (
    <main>
      {/* Profile head */}
      <div className="border-b border-border py-16">
        <div className="container">
          {p.isDemo && (
            <Badge variant="demo" className="mb-4">
              Perfil fictício · demonstração
            </Badge>
          )}
          <h1 className="font-serif text-[clamp(3rem,5vw,5rem)] font-bold tracking-[-0.035em] leading-none mt-4 mb-2">
            {p.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            {p.office} · {p.party} · {p.state}
          </p>
          {p.biography && (
            <p className="mt-4 max-w-[650px] leading-relaxed">{p.biography}</p>
          )}
          {p.sourceUrl && (
            <p className="source-note mt-3">
              Perfil:{" "}
              <a
                className="text-link"
                href={p.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Dados Abertos da Câmara dos Deputados ↗
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Profile layout */}
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] gap-16 py-0">
          {/* Main content */}
          <div>
            {/* Gastos */}
            <section className="py-9 border-b border-border">
              <h2 className="font-serif text-[1.8rem] font-bold mb-4">
                Gastos públicos
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                {p.isDemo
                  ? "Valores fictícios de demonstração."
                  : "Até 50 registros recentes da Cota para Exercício da Atividade Parlamentar, conforme resposta da Câmara. O gráfico agrupa apenas os registros exibidos."}
              </p>
              {chart.length > 0 && <ExpenseChart data={chart} />}
              <div className="mt-4 space-y-0">
                {p.expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between gap-5 py-4 border-t border-border"
                  >
                    <div>
                      <b>{expense.description}</b>
                      <div className="text-sm text-muted-foreground">
                        {expense.context}
                      </div>
                      <div className="source-note">
                        {dateBR(expense.occurredAt)} ·{" "}
                        <SourceReference source={expense.source} />
                      </div>
                    </div>
                    <strong className="whitespace-nowrap">
                      {brl(Number(expense.amount))}
                    </strong>
                  </div>
                ))}
              </div>
              {p.expensesUnavailable && (
                <Alert variant="info" className="mt-4">
                  <AlertDescription>
                    As despesas não puderam ser consultadas agora. Confira
                    diretamente a fonte oficial.
                  </AlertDescription>
                </Alert>
              )}
              {!p.expenses.length && !p.expensesUnavailable && (
                <p className="text-muted-foreground">
                  A fonte consultada não retornou despesas nesta consulta. Isso
                  não comprova ausência de gastos.
                </p>
              )}
              {p.sourceUrl && (
                <p className="source-note mt-3">
                  <a
                    className="text-link"
                    href={`${p.sourceUrl}/despesas`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir consulta de despesas na Câmara ↗
                  </a>
                </p>
              )}
            </section>

            {/* Emendas */}
            <section className="py-9 border-b border-border">
              <h2 className="font-serif text-[1.8rem] font-bold mb-4">
                Emendas
              </h2>
              {p.amendments.map((amendment) => (
                <div
                  key={amendment.id}
                  className="flex justify-between gap-5 py-4 border-t border-border"
                >
                  <div>
                    <b>{amendment.destination}</b>
                    <div className="text-sm text-muted-foreground">
                      {amendment.context}
                    </div>
                    <div className="source-note">
                      {amendment.year} ·{" "}
                      <SourceReference source={amendment.source} />
                    </div>
                  </div>
                  <strong className="whitespace-nowrap">
                    {brl(Number(amendment.amount))}
                  </strong>
                </div>
              ))}
              {!p.amendments.length && (
                <p className="text-muted-foreground">
                  Ainda não há dados de emendas vinculados a este perfil nesta
                  fonte.
                </p>
              )}
            </section>

            {/* Declarações */}
            <section className="py-9 border-b border-border">
              <h2 className="font-serif text-[1.8rem] font-bold mb-4">
                Declarações e checagens
              </h2>
              {p.statements.map((statement) => (
                <div key={statement.id} className="mb-6">
                  <blockquote className="font-serif text-[1.45rem] ml-0 border-l-4 border-primary pl-5 italic">
                    &ldquo;{statement.quote}&rdquo;
                  </blockquote>
                  <p className="text-sm text-muted-foreground mt-2">
                    {statement.context}{" "}
                    {statement.factCheck && `Checagem: ${statement.factCheck}`}
                  </p>
                  <div className="source-note">
                    {dateBR(statement.saidAt)} ·{" "}
                    <SourceReference source={statement.source} />
                  </div>
                </div>
              ))}
              {!p.statements.length && (
                <p className="text-muted-foreground">
                  Nenhuma declaração foi revisada editorialmente para este
                  perfil.
                </p>
              )}
            </section>

            {/* Processos */}
            <section className="py-9 border-b border-border">
              <h2 className="font-serif text-[1.8rem] font-bold mb-4">
                Processos e investigações
              </h2>
              {p.cases.map((legalCase) => (
                <div
                  key={legalCase.id}
                  className="py-4 border-t border-border"
                >
                  <b>{legalCase.title}</b>
                  <p className="mt-1">{legalCase.summary}</p>
                  {legalCase.outcome && <p>{legalCase.outcome}</p>}
                  <div className="source-note">
                    Situação: {legalCase.status} · {dateBR(legalCase.occurredAt)}{" "}
                    · <SourceReference source={legalCase.source} />
                  </div>
                </div>
              ))}
              {!p.cases.length && (
                <p className="text-muted-foreground">
                  Não há processos revisados neste perfil. A ausência de
                  registros aqui não indica ausência de processos em fontes
                  oficiais.
                </p>
              )}
            </section>

            {/* Linha do tempo */}
            <section className="py-9 border-b border-border">
              <h2 className="font-serif text-[1.8rem] font-bold mb-4">
                Linha do tempo
              </h2>
              {p.events.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between gap-5 py-4 border-t border-border"
                >
                  <div>
                    <b>{event.title}</b>
                    <div className="text-sm text-muted-foreground">
                      {event.description}
                    </div>
                    <div className="source-note">
                      <SourceReference source={event.source} />
                    </div>
                  </div>
                  <time className="text-sm whitespace-nowrap">
                    {dateBR(event.occurredAt)}
                  </time>
                </div>
              ))}
              {p.eventsUnavailable && (
                <Alert variant="info" className="mt-4">
                  <AlertDescription>
                    O histórico parlamentar não pôde ser consultado agora.
                  </AlertDescription>
                </Alert>
              )}
              {!p.events.length && !p.eventsUnavailable && (
                <p className="text-muted-foreground">
                  A fonte consultada não retornou eventos para este perfil.
                </p>
              )}
            </section>
          </div>

          {/* Aside */}
          <aside className="pt-9">
            <Card className="rounded-none border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-bold tracking-tight">
                  Sobre as fontes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.isDemo
                    ? "Este perfil é uma demonstração. Os registros ilustrativos não possuem documentos oficiais e não devem ser interpretados como informação sobre pessoas reais."
                    : "Os dados de deputado e as despesas vêm da API oficial da Câmara. Consulte o documento vinculado a cada registro. Emendas, acusações e checagens só aparecem após vinculação e revisão adequadas."}
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
