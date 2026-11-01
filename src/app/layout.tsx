import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/700.css";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Olhar Público", template: "%s | Olhar Público" }, description: "O poder é público. A informação também." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR" suppressHydrationWarning><body><ThemeProvider><SiteHeader />{children}<footer className="footer"><div className="container footer-inner"><div><strong>Olhar Público.</strong><div className="small muted">O poder é público. A informação também.</div></div><div className="small"><Link href="/metodologia">Metodologia e fontes</Link> · <Link href="/admin">Administração</Link></div></div></footer></ThemeProvider></body></html>; }
