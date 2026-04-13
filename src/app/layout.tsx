import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "COINEXA | Crypto Trading Simulator",
  description: "Virtual Crypto Trading Platform with Real-time Market Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased dark`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body selection:bg-primary/30">
        <AuthProvider>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(var(--surface-container-high))",
              border: "1px solid hsl(var(--outline-variant) / 0.2)",
              color: "hsl(var(--on-surface))",
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
