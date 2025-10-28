"use client";

import { useCart } from "@/entities/cart";
import { calculateCartTotals } from "@/entities/cart/lib/calculations";
import { Button } from "@/shared/ui/button";
import { formatPrice } from "@/shared/lib/utils";
import { ClearCartButton } from "@/features/clear-cart/ui/ClearCartButton";
import { useMemo } from "react";
import Link from "next/link";

/**
 * @description Віджет, що відображає підсумок кошика: загальну вартість та кнопки дій.
 */
export const CartSummary = () => {
  // 1. Отримуємо тільки `items` зі стору.
  const items = useCart((s) => s.items);

  // 2. Обчислюємо потрібні значення за допомогою `useMemo` для кешування.
  const { total, itemCount } = useMemo(
    () => calculateCartTotals(items),
    [items],
  );

  // 3. Перевіряємо `totalCount`, як і раніше.
  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="border-t p-4">
      <div className="mb-4 flex justify-between text-lg font-semibold">
        <span>Разом:</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ClearCartButton />
        <Button asChild className="w-full">
          <Link href="/checkout">Оформити</Link>
        </Button>
      </div>
    </div>
  );
};
