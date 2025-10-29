import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/widgets/header/ui/Header";
import { ThemeProvider, ThemeScript } from "@/shared/ui/theme";
import { HydrationProvider } from "@/shared/lib/hydration/HydrationProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/shared/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Крамниця | Найкращі товари",
    template: "%s | Крамниця",
  },
  description: "Демонстраційний інтернет-магазин, створений з Next.js",
  keywords: ["інтернет-магазин", "товари", "e-commerce", "крамниця"],
  authors: [{ name: "Danylo Reznichenko" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://e-commerce.reznichenko.dev",
    title: "Крамниця | Найкращі товари",
    description: "Демонстраційний інтернет-магазин, створений з Next.js",
    siteName: "Крамниця",
  },
  twitter: {
    card: "summary_large_image",
    title: "Крамниця | Найкращі товари",
    description: "Демонстраційний інтернет-магазин, створений з Next.js",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "url";

  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        {/*
          Інлайн-скрипт для миттєвого застосування теми.
          Запобігає мерехтінню при завантаженні сторінки.
        */}
        <ThemeScript />

        {/* Preconnect до критичних доменів для швидшого з'єднання */}
        <link rel="preconnect" href={supabaseUrl} />
        <link rel="dns-prefetch" href={supabaseUrl} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <HydrationProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>

            {/* Сповіщення (Toasts) */}
            <Toaster position="top-center" />

            {/* Аналітика швидкості (Vercel) */}
            <SpeedInsights />
          </ThemeProvider>
        </HydrationProvider>
      </body>
    </html>
  );
}
