"use client";

import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CartSheet } from "@/widgets/cart-sheet/ui/CartSheet";
import { ThemeToggle } from "@/shared/ui/theme";

/**
 * @widget Header
 * @description Шапка сайту, що містить навігацію, логотип та кошик.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
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

          {/* Кошик */}
          <CartSheet />
        </nav>
      </div>
    </header>
  );
}
