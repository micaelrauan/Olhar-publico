import { NextRequest, NextResponse } from "next/server";
import { listPoliticians } from "@/domain/politicians/repository";
import { politicianFilters, politicianInput } from "@/domain/politicians/schemas";
import { requireEditor } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const parsed = politicianFilters.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Filtros inválidos" }, { status: 400 });
  try { return NextResponse.json(await listPoliticians(parsed.data)); }
  catch { return NextResponse.json({ error: "Fonte pública indisponível" }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  const session = await requireEditor();
  if (!session) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  const parsed = politicianInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.$transaction(async (tx) => {
    const politician = await tx.politician.create({ data: parsed.data });
    await tx.changeLog.create({ data: { entityType: "Politician", entityId: politician.id, action: "CREATE", actorId: session.user.id!, details: { slug: politician.slug } } });
    return politician;
  });
  return NextResponse.json(created, { status: 201 });
}
