import type { Metadata } from "next";
import { MethodologyFaq } from "@/components/efferd/methodology-faq";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Metodologia e fontes" };

export default function Methodology() {
  return (
    <main className="container py-12 md:py-16">
      <div className="pb-8">
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-tight m-0 mb-3">
          Metodologia e fontes
        </h1>
        <p className="text-muted-foreground text-[1.1rem] leading-relaxed max-w-[700px]">
          Transparência exige mais que números. Cada registro precisa ser rastreável, datado e explicado.
        </p>
      </div>

      <Separator className="mb-10" />

      <div className="prose max-w-[72ch] text-[1.05rem] leading-relaxed space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold mb-2">Como tratamos informações</h2>
          <p className="text-muted-foreground">
            Documentamos a origem, a data de publicação e a data de acesso de cada fonte.
            Mantemos contexto junto a gastos, emendas, declarações e processos. Uma denúncia
            é apresentada como alegação; uma investigação, como procedimento em curso; e uma
            decisão, com seu desfecho e data.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold mb-2">Consulta pública</h2>
          <p className="text-muted-foreground">
            O diretório consulta deputados federais na API Dados Abertos da Câmara. Despesas e
            histórico são apresentados com a URL de origem. O gráfico resume apenas os registros
            exibidos, sem sugerir um total do mandato. Falhas da API são identificadas como
            indisponibilidade.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold mb-2">Revisão editorial</h2>
          <p className="text-muted-foreground">
            Rascunhos passam por revisão humana. A publicação exige fontes vinculadas, aprovação
            prévia e um revisor diferente do autor. Correções são registradas no histórico de
            alterações. Conteúdos encontrados em páginas da internet não são tratados
            automaticamente como fatos comprovados.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold mb-2">Dados de demonstração</h2>
          <p className="text-muted-foreground">
            O modo opcional de demonstração contém nomes e valores fictícios, sempre identificados.
            “Registro ilustrativo” não é uma fonte governamental.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold mb-2">Limites</h2>
          <p className="text-muted-foreground">
            A ausência de um registro na plataforma não significa que ele não exista em bases
            oficiais. Dados importados podem estar incompletos ou desatualizados; consulte sempre
            a fonte primária antes de tirar conclusões.
          </p>
        </div>
      </div>

      <MethodologyFaq />
    </main>
  );
}
