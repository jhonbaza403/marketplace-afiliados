import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Marketplace de Afiliados y Ofertas",
  description: "Plataforma moderna de productos al detal, mayor, servicios y afiliados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-zinc-50 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
