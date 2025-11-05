"use client";

import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CartSheet } from "@/widgets/cart-sheet/ui/CartSheet";
import { ThemeToggle } from "@/shared/ui/theme";
import { useIsMobile } from "@/shared/hooks/use-media-query";
import { MobileMenuSheet } from "@/widgets/mobile-menu-sheet/ui/MobileMenuSheet";
import { useState, useEffect } from "react";
import { SearchSheet } from "@/widgets/search-sheet";

/**
 * @widget Header
 * @description Адаптивна шапка сайту. Зберігає оригінальний вигляд на десктопі
 * та змінює розмітку на мобільних пристроях.
 */
export function Header() {
  const isMobile = useIsMobile();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Показуємо "скелет" десктопної версії, щоб уникнути стрибка розмітки.
    // Це гарантує, що структура DOM збігається з серверною.
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container relative mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="mr-auto flex items-center gap-2">
            <ShoppingBagIcon className="h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">Крамниця</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-10 w-24 rounded-md bg-muted/50 animate-pulse"></div>
            <div className="h-10 w-10 rounded-md bg-muted/50 animate-pulse"></div>
            <div className="h-10 w-10 rounded-md bg-muted/50 animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/75 backdrop-blur-sm">
      <div className="container relative mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <>
            {/* --- Мобільна версія --- */}

            {/* Ліва сторона: Бургер-меню */}
            <MobileMenuSheet />

            {/* Центр: Логотип (абсолютне позиціонування) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/" className="flex items-center gap-2">
                <ShoppingBagIcon className="h-6 w-6" />
                <span className="text-lg font-bold tracking-tight">
                  Крамниця
                </span>
              </Link>
            </div>

            {/* Права сторона: Кошик */}
            <div className="flex items-center gap-2">
              <SearchSheet />
              <CartSheet />
            </div>
          </>
        ) : (
          <>
            {/* --- Десктопна версія (Ваш оригінальний вигляд) --- */}

            {/* Логотип зліва, `mr-auto` відштовхує все інше вправо */}
            <Link href="/" className="mr-auto flex items-center gap-2">
              <ShoppingBagIcon className="h-6 w-6" />
              <span className="text-lg font-bold tracking-tight">Крамниця</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link href="/contacts">Контакти</Link>
              </Button>

              {/* Кнопка перемикача теми */}
              <ThemeToggle />

              {/* Кнопка пошуку */}
              <SearchSheet />

              {/* Кошик */}
              <CartSheet />
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
