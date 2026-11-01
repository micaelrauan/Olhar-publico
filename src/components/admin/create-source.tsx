"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CreateSource() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const success = response.ok;
    setIsSuccess(success);
    setMessage(
      success ? "Fonte cadastrada com sucesso." : "Não foi possível cadastrar a fonte."
    );
    if (success) {
      form.reset();
      router.refresh();
    }
  }

  return (
    <Card className="rounded-lg border-border">
      <CardHeader>
        <CardTitle className="text-xl">Cadastrar nova fonte</CardTitle>
        <CardDescription>
          Vincule documentos verificáveis às publicações e registros da plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="source-title" className="text-xs font-bold uppercase tracking-wider">
              Título do documento
            </label>
            <Input
              id="source-title"
              name="title"
              placeholder="Ex.: Relatório de Prestação de Contas 2024"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="source-publisher" className="text-xs font-bold uppercase tracking-wider">
              Órgão publicador
            </label>
            <Input
              id="source-publisher"
              name="publisher"
              placeholder="Ex.: Câmara dos Deputados"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="source-url" className="text-xs font-bold uppercase tracking-wider">
              Endereço da fonte (URL)
            </label>
            <Input
              id="source-url"
              name="url"
              type="url"
              placeholder="https://dadosabertos.camara.leg.br/..."
              required
            />
          </div>

          {message && (
            <Alert variant={isSuccess ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit">Cadastrar fonte</Button>
        </form>
      </CardContent>
    </Card>
  );
}
