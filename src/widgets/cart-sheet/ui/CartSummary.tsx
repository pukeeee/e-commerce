"use client";

import { useCart, calculateCartTotals } from "@/entities/cart";
import { Button } from "@/shared/ui/button";
import { formatPrice } from "@/shared/lib/utils";
import { ClearCartButton } from "@/features/clear-cart/ui/ClearCartButton";
import { useMemo } from "react";

// Припустимо, що кнопка "Оформити замовлення" веде на відповідну сторінку
// import Link from "next/link";

/**
 * @description Віджет, що відображає підсумок кошика: загальну вартість та кнопки дій.
 */
export const CartSummary = () => {
  // 1. Отримуємо тільки `items` зі стору.
  const items = useCart((s) => s.items);

  // 2. Обчислюємо потрібні значення за допомогою `useMemo` для кешування.
  const { totalPrice, totalCount } = useMemo(
    () => calculateCartTotals(items),
    [items],
  );

  // 3. Перевіряємо `totalCount`, як і раніше.
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="border-t p-4">
      <div className="mb-4 flex justify-between text-lg font-semibold">
        <span>Разом:</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ClearCartButton />
        {/* <Link href="/checkout" passHref> */}
        <Button asChild className="w-full">
          {/* <a>Оформити замовлення</a> */}
          <a>Оформити</a>
        </Button>
        {/* </Link> */}
      </div>
    </div>
  );
};
