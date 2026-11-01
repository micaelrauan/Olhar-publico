import { prisma } from "@/lib/prisma";
import { Users, Database, FileClock, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function Admin() {
  const counts = process.env.DATABASE_URL
    ? await Promise.all([
        prisma.politician.count(),
        prisma.source.count(),
        prisma.publication.count({ where: { status: "IN_REVIEW" } }),
      ]).catch(() => [0, 0, 0])
    : [0, 0, 0];

  const stats = [
    {
      title: "Políticos cadastrados",
      value: counts[0],
      description: "Perfis armazenados no banco de dados",
      icon: Users,
    },
    {
      title: "Fontes de evidência",
      value: counts[1],
      description: "Documentos e URLs de origem vinculados",
      icon: Database,
    },
    {
      title: "Publicações em revisão",
      value: counts[2],
      description: "Textos aguardando parecer editorial",
      icon: FileClock,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          Visão geral
        </h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe o acervo e o fluxo de revisão da plataforma.
        </p>
      </div>

      {/* Stats Grid - shadcnSpace Stats pattern */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="rounded-lg border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold font-sans text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="font-serif text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Responsibility Banner */}
      <Alert variant="info" className="border-border">
        <ShieldAlert className="h-5 w-5 text-primary" />
        <AlertTitle className="text-base font-bold font-sans">
          Publicação com responsabilidade
        </AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
          Agentes autônomos podem produzir rascunhos e logs em ambiente isolado, mas
          não possuem permissão de publicação direta. A checagem de fatos e a aprovação
          editorial final são estritamente humanas.
        </AlertDescription>
      </Alert>
    </div>
  );
}
