"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CreatePolitician() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <Card className="rounded-lg border-border">
      <CardHeader>
        <CardTitle className="text-xl">Cadastrar novo político</CardTitle>
        <CardDescription>
          Preencha os dados institucionais para inclusão no acervo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = Object.fromEntries(new FormData(form));
            const response = await fetch("/api/politicians", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            const ok = response.ok;
            setIsSuccess(ok);
            setMessage(
              ok
                ? "Perfil cadastrado com sucesso."
                : "Não foi possível cadastrar. Revise os campos e o slug."
            );
            if (ok) {
              form.reset();
              router.refresh();
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">
                Nome completo
              </label>
              <Input id="name" name="name" placeholder="Nome" required />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider">
                Slug (identificador URL)
              </label>
              <Input id="slug" name="slug" placeholder="nome-sobrenome" required />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="party" className="text-xs font-bold uppercase tracking-wider">
                Partido
              </label>
              <Input id="party" name="party" placeholder="Sigla do partido" required />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="office" className="text-xs font-bold uppercase tracking-wider">
                Cargo
              </label>
              <Input id="office" name="office" placeholder="Ex.: Deputado federal" required />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="state" className="text-xs font-bold uppercase tracking-wider">
                Estado (UF)
              </label>
              <Input id="state" name="state" placeholder="UF" maxLength={2} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="biography" className="text-xs font-bold uppercase tracking-wider">
              Biografia e contexto
            </label>
            <Textarea
              id="biography"
              name="biography"
              placeholder="Histórico institucional e mandatos"
              required
            />
          </div>

          {message && (
            <Alert variant={isSuccess ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit">Cadastrar político</Button>
        </form>
      </CardContent>
    </Card>
  );
}
