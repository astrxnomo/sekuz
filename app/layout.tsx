import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* ---------------------------------------------------------------
   Tipografía — familia Geist completa, autoalojada

   Dos fuentes para todo el sitio:
     · Geist Pixel Square → titulares y marca
     · Geist Mono         → cuerpo, etiquetas, cifras, citas

   Ambas son SIL OFL (libres, uso comercial incluido) y viven en
   app/fonts/, así que no hay peticiones a terceros ni dependencia
   de Google Fonts. Ver app/fonts/README.md
   --------------------------------------------------------------- */

// Titulares y marca
const pixel = localFont({
  src: "./fonts/GeistPixel-Square.woff2",
  variable: "--font-pixel",
  display: "swap",
});

// Todo lo demás. Un solo archivo variable cubre el rango 100–900.
const mono = localFont({
  src: [
    {
      path: "./fonts/GeistMono-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/GeistMono-VariableItalic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sekuz — Inteligencia artificial aplicada a operaciones",
  description:
    "Diseñamos y construimos agentes, automatizaciones y aplicaciones con IA que se integran a tu operación real.",
  openGraph: {
    title: "Sekuz — Inteligencia artificial aplicada a operaciones",
    description:
      "Agentes, automatizaciones y aplicaciones con IA construidos con la seriedad del software crítico.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${pixel.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
