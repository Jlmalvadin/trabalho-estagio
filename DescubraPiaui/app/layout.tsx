import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Descubra Piauí | Pontos Turísticos",
  description: "Explore os principais pontos turísticos do Piauí, de Teresina ao litoral e ao sertão. Descubra museus, parques, monumentos, praias e muito mais!",
  authors: [{ name: "João Lucas" }],
  keywords: ["Piauí", "Teresina", "turismo", "pontos turísticos", "Brasil", "parques", "museus", "verde"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}