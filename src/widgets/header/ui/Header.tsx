"use client";

import Link from "next/link";
import { Apple } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CartSheet } from "@/widgets/cart-sheet/ui/CartSheet";
import { ThemeToggle } from "@/shared/ui/theme";
import { useIsMobile } from "@/shared/hooks/use-media-query";
import { memo, useState, useEffect } from "react";
import { SearchSheet } from "@/widgets/search-sheet";
import { WishlistSheet } from "@/widgets/wishlist-sheet";
import { cn } from "@/shared/lib/utils";

const HeaderLogo = memo(() => (
  <Link href="/" className="flex items-center gap-1">
    <Apple className="h-6 w-6 text-primary" />
    <span className="text-lg font-bold tracking-tight">The Orchard</span>
  </Link>
));
HeaderLogo.displayName = "HeaderLogo";

const DesktopNav = memo(() => (
  <nav className="flex items-center gap-4">
    <Button asChild variant="ghost">
      <Link href="/contacts">Контакты</Link>
    </Button>
    <ThemeToggle />
    <SearchSheet />
    <WishlistSheet />
    <CartSheet />
  </nav>
));
DesktopNav.displayName = "DesktopNav";

const MobileNav = memo(() => (
  <>
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <HeaderLogo />
    </div>
    <div className="flex items-center gap-2 ml-auto">
      <ThemeToggle />
    </div>
  </>
));
MobileNav.displayName = "MobileNav";

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
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container relative mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Render a centered logo placeholder for mobile to avoid layout shift */}
          <div className="flex-1 md:hidden" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
            <HeaderLogo />
          </div>
          <div className="hidden md:flex md:flex-1 md:items-center">
            <HeaderLogo />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-md bg-muted/50 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "w-full border-b z-40",
        isMobile
          ? "relative bg-background"
          : "sticky top-0 bg-background/75 backdrop-blur-sm",
      )}
    >
      <div className="container relative mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <MobileNav />
        ) : (
          <>
            <div className="mr-auto">
              <HeaderLogo />
            </div>
            <DesktopNav />
          </>
        )}
      </div>
    </header>
  );
}
