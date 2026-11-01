"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    id: "origem",
    title: "Como verificar a origem de um dado?",
    content:
      "Abra o documento vinculado ao registro e confira o órgão publicador, a data de publicação e a data de acesso. Os dados fictícios de demonstração não possuem documentos oficiais.",
  },
  {
    id: "processos",
    title: "Uma investigação comprova culpa?",
    content:
      "Não. Uma alegação, uma investigação e uma decisão judicial têm significados diferentes. A situação e o desfecho devem aparecer junto ao registro, com fonte e data.",
  },
  {
    id: "ausencia",
    title: "A ausência de um registro significa que não existe?",
    content:
      "Não. O acervo pode estar incompleto ou desatualizado. A consulta às bases oficiais continua necessária antes de tirar conclusões.",
  },
  {
    id: "correcao",
    title: "Como as correções são acompanhadas?",
    content:
      "As publicações possuem histórico de revisões. Alterações administrativas de políticos e fontes também geram registros de mudança.",
  },
];

export function MethodologyFaq() {
  return (
    <section className="max-w-[760px] my-16" aria-labelledby="faq-title">
      <div className="mb-6">
        <h2 id="faq-title" className="font-serif text-2xl md:text-3xl font-bold mb-2">
          Perguntas frequentes
        </h2>
        <p className="text-muted-foreground text-sm">
          Respostas rápidas para interpretar os dados com cuidado.
        </p>
      </div>
      <Accordion type="single" collapsible defaultValue="origem" className="w-full">
        {questions.map((item) => (
          <AccordionItem value={item.id} key={item.id}>
            <AccordionTrigger className="text-base font-semibold">
              {item.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="leading-relaxed">{item.content}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
