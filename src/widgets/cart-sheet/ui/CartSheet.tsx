"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useCart } from "@/entities/cart";
import { CartItemsList } from "./CartItemsList";
import { CartSummary } from "./CartSummary";
import { useMemo, memo } from "react";
import { ClientOnly } from "@/shared/lib/hydration/ClientOnly";

const CartBadge = memo(() => {
  const items = useCart((state) => state.items);
  const count = useMemo(() => Object.keys(items).length, [items]);

  if (count === 0) return null;

  return (
    <Badge
      variant="destructive"
      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs"
    >
      {count}
    </Badge>
  );
});
CartBadge.displayName = "CartBadge";

/**
 * @description
 * Головний віджет кошика, реалізований як висувна панель (Sheet).
 * Поєднує в собі тригер (кнопку), список товарів та підсумок.
 */
export const CartSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Відкрити кошик</span>
          <ClientOnly>
            <CartBadge />
          </ClientOnly>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Ваш кошик</SheetTitle>
        </SheetHeader>

        <div className="my-4 flex-1 overflow-y-auto px-6">
          <CartItemsList />
        </div>

        <SheetFooter>
          <CartSummary />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
