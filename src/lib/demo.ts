export const demoSource = { title: "Registro ilustrativo", publisher: "Olhar Público · demonstração", url: "", accessedAt: "2026-01-15" };

export const demoPoliticians = [
  { slug: "ana-martins-demo", name: "Ana Martins", party: "PARTIDO DEMO", office: "Deputada federal", state: "SP", biography: "Personagem fictícia criada para demonstrar a organização de dados públicos no Olhar Público.", isDemo: true },
  { slug: "bruno-costa-demo", name: "Bruno Costa", party: "PARTIDO EXEMPLO", office: "Senador", state: "MG", biography: "Personagem fictício. Nenhuma informação desta página representa uma pessoa real.", isDemo: true },
  { slug: "carla-souza-demo", name: "Carla Souza", party: "PARTIDO DEMO", office: "Deputada estadual", state: "RJ", biography: "Personagem fictícia para demonstração do diretório.", isDemo: true },
];

export const demoProfile = {
  expenses: [
    { id: "e1", description: "Passagens aéreas", amount: 8420.5, occurredAt: "2025-11-12", context: "Valor ilustrativo para exemplificar uma despesa parlamentar.", source: demoSource },
    { id: "e2", description: "Locação de escritório", amount: 5200, occurredAt: "2025-10-08", context: "Valor ilustrativo. Sem relação com gasto público real.", source: demoSource },
    { id: "e3", description: "Divulgação de atividade parlamentar", amount: 3180, occurredAt: "2025-09-19", context: "Valor ilustrativo para demonstração visual.", source: demoSource },
  ],
  amendments: [{ id: "a1", destination: "Atenção básica à saúde · SP", amount: 850000, year: 2025, context: "Destinação fictícia, sem beneficiário real.", source: demoSource }],
  statements: [{ id: "s1", quote: "A transparência precisa ser compreensível para todos.", saidAt: "2025-08-14", context: "Declaração fictícia criada para esta demonstração.", factCheck: "Não se aplica: fala fictícia.", source: demoSource }],
  cases: [] as { id: string; title: string; status: string; summary: string; outcome?: string; occurredAt: string; source: typeof demoSource }[],
  events: [
    { id: "t1", title: "Início de mandato", description: "Evento fictício de demonstração.", occurredAt: "2025-02-01", source: demoSource },
    { id: "t2", title: "Registro de emenda", description: "Evento fictício de demonstração.", occurredAt: "2025-06-18", source: demoSource },
  ],
};

export const demoNews = [
  { slug: "como-ler-uma-despesa", title: "Como ler uma despesa parlamentar", summary: "Um guia de demonstração para entender valores, datas e documentos de origem.", date: "2026-01-15", category: "Guia", isDemo: true },
  { slug: "por-que-o-contexto-importa", title: "Por que o contexto importa em dados públicos", summary: "Números isolados podem confundir. Entenda o papel das fontes e da revisão editorial.", date: "2026-01-10", category: "Metodologia", isDemo: true },
];
