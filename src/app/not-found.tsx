import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container min-h-[65vh] flex items-center justify-center text-center py-16">
      <div className="border-y border-border py-12 px-7 max-w-[620px] w-full">
        <strong className="block font-serif text-7xl font-bold text-primary leading-none" aria-hidden="true">
          404
        </strong>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mt-4 mb-3">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
          Este endereço pode ter mudado ou não existe. Continue pelo diretório ou volte ao início.
        </p>
        <div className="flex justify-center gap-3 flex-wrap mt-7">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4" /> Início
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/politicos">
              <Compass className="h-4 w-4" /> Explorar políticos
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
