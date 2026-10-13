import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. AQUÍ BLOQUEAS EL ZOOM EN TODO EL PROYECTO
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Bloquea el zoom táctil
};

// 2. Personaliza los metadatos de tu PWA
export const metadata: Metadata = {
  title: "FitVoxel - Comparador de Suplementos y Gimnasios",
  description: "Encuentra la mejor opción en suplementos y gimnasios en Caracas y Venezuela.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}