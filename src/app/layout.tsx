import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Olhar Público", template: "%s | Olhar Público" },
  description: "O poder é público. A informação também.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${sourceSerif4.variable}`}
    >
      <body>
        <ThemeProvider>
          <SiteHeader />
          {children}
          <footer className="border-t border-border mt-16">
            <div className="container py-9">
              <div className="flex items-center justify-between gap-5 flex-wrap">
                <div>
                  <strong className="font-serif text-lg">Olhar Público.</strong>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    O poder é público. A informação também.
                  </p>
                </div>
                <nav className="flex items-center gap-4 text-sm" aria-label="Links do rodapé">
                  <Link
                    href="/metodologia"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Metodologia e fontes
                  </Link>
                  <Separator orientation="vertical" className="h-4" />
                  <Link
                    href="/admin"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Administração
                  </Link>
                </nav>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
