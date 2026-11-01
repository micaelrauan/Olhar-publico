"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ReviewAction({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const choices =
    status === "DRAFT"
      ? ["IN_REVIEW"]
      : status === "IN_REVIEW"
      ? ["APPROVED", "REJECTED"]
      : status === "APPROVED"
      ? ["PUBLISHED", "REJECTED"]
      : [];

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap items-center">
        {choices.map((decision) => (
          <Button
            key={decision}
            variant="outline"
            size="sm"
            onClick={async () => {
              const note = window.prompt(
                "Registre o motivo da decisão (mínimo 5 caracteres):"
              );
              if (!note) return;
              const response = await fetch(`/api/publications/${id}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision, note }),
              });
              const data = await response.json();
              setMessage(response.ok ? "Decisão registrada." : data.error ?? "Falha na revisão.");
              router.refresh();
            }}
          >
            {decision}
          </Button>
        ))}
      </div>
      {message && <p role="status" className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
