export const agentNames = ["ResearchAgent", "ValidationAgent", "FinancialAgent", "FactCheckAgent", "EditorialAgent", "AuditAgent"] as const;
export type AgentName = typeof agentNames[number];
export type Evidence = { sourceUrl: string; sourceTitle: string; accessedAt: string; excerpt?: string };
export type AgentInput = { subjectId: string; requestId: string; evidence: Evidence[] };
export type AgentDraft = { summary: string; findings: { text: string; evidence: Evidence[]; confidence: "low" | "medium" | "high" }[]; requiresHumanReview: true };
export type AgentLog = { id: string; agent: AgentName; action: string; status: "mock" | "queued" | "failed"; createdAt: string; details: Record<string, unknown> };
export interface AgentContract { readonly name: AgentName; run(input: AgentInput): Promise<AgentDraft>; }
export function createMockAgent(name: AgentName): AgentContract { return { name, async run(input) { return { summary: `Simulação de ${name} para ${input.subjectId}. Nenhuma análise real foi executada.`, findings: [], requiresHumanReview: true }; } }; }
export const mockAgentLogs: AgentLog[] = [{ id: "mock-1", agent: "ResearchAgent", action: "Preparação de coleta", status: "mock", createdAt: "2026-01-15T12:00:00Z", details: { note: "Somente demonstração" } }];
