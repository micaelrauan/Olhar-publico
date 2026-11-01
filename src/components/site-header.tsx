"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuToggleIcon } from "@/components/efferd/menu-toggle-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { useScroll } from "@/hooks/use-scroll";

// Estrutura de navegação e menu móvel adaptada do bloco header-1 do Efferd UI (MIT).
const links = [{ href: "/politicos", label: "Políticos" }, { href: "/noticias", label: "Notícias" }, { href: "/metodologia", label: "Metodologia" }];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const scrolled = useScroll();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onEscape);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onEscape); };
  }, [open]);

  return <header className={`header efferd-header${scrolled ? " efferd-header--scrolled" : ""}`}><div className="container header-inner"><Link href="/" className="brand">Olhar <span>Público.</span></Link><nav className="nav desktop-nav" aria-label="Navegação principal">{links.map((link) => <Link href={link.href} key={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}<ThemeToggle /></nav><button type="button" className="menu-toggle button button-outline" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}><MenuToggleIcon open={open} /></button></div>{mounted && open && createPortal(<div id="mobile-menu" className="mobile-menu"><nav aria-label="Navegação móvel">{links.map((link) => <Link href={link.href} key={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}</nav><div className="mobile-menu-theme"><span>Alternar tema</span><ThemeToggle /></div></div>, document.body)}</header>;
}
