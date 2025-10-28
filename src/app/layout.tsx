import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/widgets/header/ui/Header";
import { ThemeProvider, ThemeScript } from "@/shared/ui/theme";
import { HydrationProvider } from "@/shared/lib/hydration/HydrationProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Крамниця | Найкращі товари",
  description: "Демонстраційний інтернет-магазин, створений з Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        {/*
          Інлайн-скрипт для миттєвого застосування теми.
          Запобігає мерехтінню при завантаженні сторінки.
        */}
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <HydrationProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <SpeedInsights />
          </ThemeProvider>
        </HydrationProvider>
      </body>
    </html>
  );
}
