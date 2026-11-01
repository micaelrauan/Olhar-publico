"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

const links = [
  { href: "/politicos", label: "Políticos" },
  { href: "/noticias", label: "Notícias" },
  { href: "/metodologia", label: "Metodologia" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScroll();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-card transition-shadow duration-200",
        scrolled && "shadow-sm"
      )}
    >
      <div className="container flex min-h-[76px] items-center justify-between gap-5">
        {/* Brand */}
        <Link
          href="/"
          className="font-serif text-[1.6rem] font-bold tracking-[-0.035em] whitespace-nowrap"
        >
          Olhar <span className="text-primary">Público.</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-bold"
          aria-label="Navegação principal"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === link.href && "text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile: theme + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72 pt-14">
          <SheetHeader className="sr-only">
            <SheetTitle>Navegação</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col" aria-label="Navegação móvel">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "font-serif text-2xl py-5 border-b border-border text-foreground hover:text-primary transition-colors",
                  pathname === link.href && "text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Separator className="mt-6" />
          <div className="flex items-center justify-between pt-5">
            <span className="text-sm text-muted-foreground">Alternar tema</span>
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
