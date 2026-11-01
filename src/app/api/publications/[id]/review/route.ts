import { NextResponse } from "next/server";
import { z } from "zod";
import { requireEditor } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const input = z.object({ decision: z.enum(["IN_REVIEW", "APPROVED", "REJECTED", "PUBLISHED"]), note: z.string().min(5) });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireEditor();
  if (!session) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const id = (await params).id;
  const publication = await prisma.publication.findUnique({ where: { id }, include: { sources: true } });
  if (!publication) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  const allowed: Record<string, string[]> = { DRAFT: ["IN_REVIEW"], IN_REVIEW: ["APPROVED", "REJECTED"], APPROVED: ["PUBLISHED", "REJECTED"], REJECTED: ["IN_REVIEW"], PUBLISHED: [] };
  if (!allowed[publication.status].includes(parsed.data.decision)) return NextResponse.json({ error: "Transição editorial inválida" }, { status: 409 });
  if (parsed.data.decision === "APPROVED" && publication.authorId === session.user.id) return NextResponse.json({ error: "O autor não pode aprovar o próprio texto" }, { status: 409 });
  if (parsed.data.decision === "PUBLISHED" && (publication.status !== "APPROVED" || publication.sources.length === 0 || publication.authorId === session.user.id)) return NextResponse.json({ error: "Publicação requer fontes, aprovação prévia e outro revisor humano" }, { status: 409 });
  const updated = await prisma.publication.update({ where: { id }, data: { status: parsed.data.decision, publishedAt: parsed.data.decision === "PUBLISHED" ? new Date() : undefined, revisions: { create: { editorId: session.user.id, note: parsed.data.note, snapshot: { decision: parsed.data.decision } } } } });
  return NextResponse.json(updated);
}
