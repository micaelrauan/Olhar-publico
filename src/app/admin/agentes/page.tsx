import { agentNames, mockAgentLogs } from "@/domain/agents/contracts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Agents() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          Agentes
        </h1>
        <p className="text-muted-foreground mt-1">
          Área preparada para contratos e monitoramento. Nenhuma integração com LLM está ativa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contratos de agentes</CardTitle>
          <CardDescription>
            Definições formais para fluxos de processamento supervisionado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          <div className="border-t border-border">
            {agentNames.map((name) => (
              <div
                key={name}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
              >
                <b className="font-mono text-sm">{name}</b>
                <span className="text-xs text-muted-foreground">
                  Contrato disponível · execução desativada
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Logs demonstrativos</CardTitle>
          <CardDescription>
            Exemplo de auditoria e rastreabilidade de ações executadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          <div className="border-t border-border">
            {mockAgentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
              >
                <span className="text-sm">
                  <span className="font-semibold">{log.agent}</span> · {log.action}
                </span>
                <Badge variant="demo">{log.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
