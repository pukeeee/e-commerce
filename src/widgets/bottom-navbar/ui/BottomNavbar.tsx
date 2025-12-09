"use client";

import { Home, User, Search } from "lucide-react";
import Link from "next/link";
import { memo, useState, useEffect } from "react";
import { useIsMobile } from "@/shared/hooks/use-media-query";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { CartSheet } from "@/widgets/cart-sheet/ui/CartSheet";
import { SearchSheet } from "@/widgets/search-sheet";
import { WishlistSheet } from "@/widgets/wishlist-sheet";

const NavLink = memo(
  ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
    <Button asChild variant="ghost" className="h-14 w-14 rounded-full">
      <Link href={href}>
        <Icon className="h-7 w-7" />
      </Link>
    </Button>
  ),
);
NavLink.displayName = "NavLink";

/**
 * @widget BottomNavbar
 * @description Навігаційна панель для мобільних пристроїв, що з'являється внизу екрана.
 * Має напівпрозорий фон з ефектом розмиття ("liquid glass").
 */
export function BottomNavbar() {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isMobile) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full px-3 pb-4 pt-2 md:hidden">
      <div
        className={cn(
          "relative mx-auto flex max-w-sm items-center justify-around rounded-full border bg-background/60 p-1",
          // Ефект "Liquid Glass"
          "backdrop-blur-lg backdrop-saturate-150",
        )}
      >
        <NavLink href="/" icon={Home} />
        <SearchSheet
          trigger={
            <Button variant="ghost" className="h-14 w-14 rounded-full">
              <Search className="h-7 w-7" />
            </Button>
          }
        />
        <CartSheet
          triggerProps={{
            variant: "ghost",
            size: null,
            className: "h-14 w-14 rounded-full",
          }}
        />
        <WishlistSheet
          triggerProps={{
            variant: "ghost",
            size: null,
            className: "h-14 w-14 rounded-full",
          }}
        />
        <Button
          variant="ghost"
          className="h-14 w-14 rounded-full"
          disabled // TODO: Реалізувати сторінку профілю
        >
          <User className="h-7 w-7" />
        </Button>
      </div>
    </footer>
  );
}
