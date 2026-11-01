import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// Composição adaptada do bloco not-found-1 do Efferd UI (MIT).
export default function NotFound() { return <main className="container efferd-not-found"><div className="efferd-not-found-inner"><strong aria-hidden="true">404</strong><h1>Página não encontrada</h1><p>Este endereço pode ter mudado ou não existe. Continue pelo diretório ou volte ao início.</p><div><Button asChild><Link href="/"><Home size={17} /> Início</Link></Button><Button asChild variant="outline"><Link href="/politicos"><Compass size={17} /> Explorar políticos</Link></Button></div></div></main>; }
