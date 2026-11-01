import { NextResponse } from "next/server";
import { getPolitician } from "@/domain/politicians/repository";
import { politicianInput } from "@/domain/politicians/schemas";
import { requireEditor } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const profile = await getPolitician((await params).slug);
    return profile ? NextResponse.json(profile) : NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  } catch { return NextResponse.json({ error: "Fonte pública indisponível" }, { status: 503 }); }
}
export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireEditor();
  if (!session) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  const parsed = politicianInput.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const updated = await prisma.$transaction(async (tx) => {
    const politician = await tx.politician.update({ where: { slug: (await params).slug }, data: parsed.data });
    await tx.changeLog.create({ data: { entityType: "Politician", entityId: politician.id, action: "UPDATE", actorId: session.user.id!, details: { changedFields: Object.keys(parsed.data) } } });
    return politician;
  });
  return NextResponse.json(updated);
}
