"use client";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

// Estrutura do bloco faqs-1 do Efferd UI (MIT), com conteúdo do Olhar Público.
const questions = [
  { id: "origem", title: "Como verificar a origem de um dado?", content: "Abra o documento vinculado ao registro e confira o órgão publicador, a data de publicação e a data de acesso. Os dados fictícios de demonstração não possuem documentos oficiais." },
  { id: "processos", title: "Uma investigação comprova culpa?", content: "Não. Uma alegação, uma investigação e uma decisão judicial têm significados diferentes. A situação e o desfecho devem aparecer junto ao registro, com fonte e data." },
  { id: "ausencia", title: "A ausência de um registro significa que não existe?", content: "Não. O acervo pode estar incompleto ou desatualizado. A consulta às bases oficiais continua necessária antes de tirar conclusões." },
  { id: "correcao", title: "Como as correções são acompanhadas?", content: "As publicações possuem histórico de revisões. Alterações administrativas de políticos e fontes também geram registros de mudança." },
];

export function MethodologyFaq() { return <section className="efferd-faq" aria-labelledby="faq-title"><div className="efferd-faq-heading"><h2 id="faq-title">Perguntas frequentes</h2><p>Respostas rápidas para interpretar os dados com cuidado.</p></div><Accordion.Root type="single" collapsible defaultValue="origem" className="efferd-faq-list">{questions.map((item) => <Accordion.Item value={item.id} key={item.id} className="efferd-faq-item"><Accordion.Header><Accordion.Trigger className="efferd-faq-trigger">{item.title}<ChevronDown size={18} aria-hidden="true" /></Accordion.Trigger></Accordion.Header><Accordion.Content className="efferd-faq-content"><p>{item.content}</p></Accordion.Content></Accordion.Item>)}</Accordion.Root></section>; }
