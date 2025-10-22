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
import { useMemo } from "react";

/**
 * @description
 * Головний віджет кошика, реалізований як висувна панель (Sheet).
 * Поєднує в собі тригер (кнопку), список товарів та підсумок.
 */
export const CartSheet = () => {
  // Отримуємо тільки `items` зі стору.
  const items = useCart((state) => state.items);

  // Обчислюємо кількість унікальних товарів, просто рахуючи ключі об'єкта.
  const uniqueItemsCount = useMemo(() => {
    return Object.keys(items).length;
  }, [items]);

  // Умовний рендеринг бейджа. Він з'явиться, як тільки `items` будуть завантажені.
  const badge =
    uniqueItemsCount > 0 ? (
      <Badge
        variant="destructive"
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs"
      >
        {uniqueItemsCount}
      </Badge>
    ) : null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Відкрити кошик</span>
          {/* 5. Рендеримо бейдж тут */}
          {badge}
        </Button>
      </SheetTrigger>

      {/* 4. Вміст кошика, що з'являється на панелі. */}
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Ваш кошик</SheetTitle>
        </SheetHeader>

        {/* 5. Список товарів. Займає весь доступний простір і має власну прокрутку. */}
        <div className="my-4 flex-1 overflow-y-auto px-6">
          <CartItemsList />
        </div>

        {/* 6. Підсумок. Завжди знаходиться внизу панелі. */}
        <SheetFooter>
          <CartSummary />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
