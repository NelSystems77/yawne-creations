import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Yawne Creations — Artesanías únicas hechas a mano",
  description:
    "Productos artesanales 100% hechos a mano. Cada pieza es única y nace del corazón. Ubicados en Tres Ríos, Costa Rica.",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
    apple: "/icons/icon-152.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A2744",
                color: "#E8F0F8",
                border: "1px solid #1E3254",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
