"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CreatePublication({
  sources,
}: {
  sources: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <Card className="rounded-lg border-border">
      <CardHeader>
        <CardTitle className="text-xl">Novo rascunho</CardTitle>
        <CardDescription>
          Redija um artigo para posterior revisão editorial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = Object.fromEntries(new FormData(form));
            const response = await fetch("/api/publications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...data, sourceIds: [data.sourceId] }),
            });
            const ok = response.ok;
            setIsSuccess(ok);
            setMessage(
              ok
                ? "Rascunho criado e encaminhado para revisão."
                : "Não foi possível criar o rascunho. Verifique os campos."
            );
            if (ok) {
              form.reset();
              router.refresh();
            }
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="pub-title" className="text-xs font-bold uppercase tracking-wider">
              Título
            </label>
            <Input id="pub-title" name="title" placeholder="Título da publicação" required />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pub-slug" className="text-xs font-bold uppercase tracking-wider">
              Slug (identificador URL)
            </label>
            <Input id="pub-slug" name="slug" placeholder="slug-da-publicacao" required />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pub-summary" className="text-xs font-bold uppercase tracking-wider">
              Resumo
            </label>
            <Textarea
              id="pub-summary"
              name="summary"
              placeholder="Resumo objetivo do conteúdo"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pub-body" className="text-xs font-bold uppercase tracking-wider">
              Texto completo
            </label>
            <Textarea
              id="pub-body"
              name="body"
              placeholder="Corpo da publicação..."
              className="min-h-[160px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pub-source" className="text-xs font-bold uppercase tracking-wider">
              Fonte obrigatória
            </label>
            <Select id="pub-source" name="sourceId" required defaultValue="">
              <option value="" disabled>
                Selecione uma fonte vinculada
              </option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </Select>
          </div>

          {!sources.length && (
            <Alert variant="warning">
              <AlertDescription>
                É necessário cadastrar ao menos uma fonte antes de redigir publicações.
              </AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert variant={isSuccess ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={!sources.length}>
            Criar rascunho
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
