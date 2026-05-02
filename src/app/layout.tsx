import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | El aula de Mayo",
    default: "El aula de Mayo",
  },
  description: "Calificaciones y opiniones para los cursos de Marcos Guillermo Castrejón Ramírez. Docencia, acompañamiento académico y mejora continua.",
  openGraph: {
    title: "El aula de Mayo",
    description: "Docencia, acompañamiento académico y mejora continua.",
    url: "https://elaulademayo.vercel.app",
    siteName: "El aula de Mayo",
    images: [
      {
        // BUG-20 fix: URL absoluta para que funcione en redes sociales
        url: "https://elaulademayo.vercel.app/logo.jpg",
        width: 800,
        height: 600,
        alt: "Logo El aula de Mayo",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "El aula de Mayo",
    description: "Docencia, acompañamiento académico y mejora continua.",
    // BUG-20 fix: URL absoluta
    images: ["https://elaulademayo.vercel.app/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer"; // BUG-16 fix: Footer no estaba importado

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          {/* BUG-16 fix: Footer añadido al layout — antes nunca se renderizaba */}
          <Footer />
        </div>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
