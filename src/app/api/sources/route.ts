import { NextResponse } from "next/server";
import { z } from "zod";
import { requireEditor } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const input = z.object({ title: z.string().min(2), url: z.url(), publisher: z.string().min(2), publishedAt: z.iso.datetime().optional() });
export async function GET() {
  if (!(await requireEditor())) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  return NextResponse.json(await prisma.source.findMany({ orderBy: { createdAt: "desc" }, take: 100 }));
}
export async function POST(request: Request) {
  const session = await requireEditor();
  if (!session) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const { publishedAt, ...data } = parsed.data;
  const created = await prisma.$transaction(async (tx) => {
    const source = await tx.source.create({ data: { ...data, publishedAt: publishedAt ? new Date(publishedAt) : undefined } });
    await tx.changeLog.create({ data: { entityType: "Source", entityId: source.id, action: "CREATE", actorId: session.user.id!, details: { url: source.url } } });
    return source;
  });
  return NextResponse.json(created, { status: 201 });
}
