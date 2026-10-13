'use client'

import { useEffect } from "react";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Desactivar Zoom por doble toque (Double-tap to zoom)
    let lastTouchEnd = 0;
    const preventDoubleTap = (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    // 2. Desactivar Zoom multitáctil de pellizco (Pinch-to-zoom)
    const preventPinchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    // Escuchar eventos en el documento de forma pasiva = false
    document.addEventListener("touchstart", preventPinchZoom, { passive: false });
    document.addEventListener("touchend", preventDoubleTap, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventPinchZoom);
      document.removeEventListener("touchend", preventDoubleTap);
    };
  }, []);

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}