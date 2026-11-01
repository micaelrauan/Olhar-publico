import { NextResponse } from "next/server";
import { z } from "zod";
import { requireEditor } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const input = z.object({ slug: z.string().regex(/^[a-z0-9-]+$/), title: z.string().min(5), summary: z.string().min(10), body: z.string().min(20), sourceIds: z.array(z.string()).min(1) });
export async function GET() {
  if (!(await requireEditor())) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  return NextResponse.json(await prisma.publication.findMany({ include: { sources: { include: { source: true } } }, orderBy: { updatedAt: "desc" } }));
}
export async function POST(request: Request) {
  const session = await requireEditor();
  if (!session) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const { sourceIds, ...data } = parsed.data;
  const created = await prisma.publication.create({ data: { ...data, authorId: session.user.id, sources: { create: sourceIds.map((sourceId) => ({ sourceId })) }, revisions: { create: { editorId: session.user.id, note: "Rascunho criado", snapshot: data } } } });
  return NextResponse.json(created, { status: 201 });
}
