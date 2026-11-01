"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

// Estrutura e marcações de canto adaptadas do bloco form-2 do Efferd UI (MIT).
export function CreateSource() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/sources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setMessage(response.ok ? "Fonte cadastrada." : "Não foi possível cadastrar a fonte.");
    if (response.ok) { form.reset(); router.refresh(); }
  }
  return <form className="efferd-form-frame" onSubmit={submit}>
    <Plus className="efferd-form-corner efferd-form-corner--top" size={24} strokeWidth={1} aria-hidden="true" />
    <Plus className="efferd-form-corner efferd-form-corner--bottom" size={24} strokeWidth={1} aria-hidden="true" />
    <div className="efferd-form-heading"><h2>Cadastrar fonte</h2><p>Vincule documentos verificáveis às publicações e registros.</p></div>
    <div className="efferd-form-fields"><div><label htmlFor="source-title">Título do documento</label><input id="source-title" name="title" className="input" placeholder="Ex.: Relatório oficial" required /></div><div><label htmlFor="source-publisher">Órgão publicador</label><input id="source-publisher" name="publisher" className="input" placeholder="Ex.: Câmara dos Deputados" required /></div><div><label htmlFor="source-url">Endereço da fonte</label><input id="source-url" name="url" className="input" type="url" placeholder="https://..." required /></div></div>
    <button className="button" type="submit">Cadastrar fonte</button>{message && <p role="status" className="small">{message}</p>}
  </form>;
}
