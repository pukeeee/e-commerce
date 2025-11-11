"use client";

import { useCartItems } from "@/entities/cart";
import { formatPrice } from "@/shared/lib/utils";
import { useMemo } from "react";

/**
 * @description Віджет, що відображає підсумок кошика: загальну вартість.
 */
export const CartSummary = () => {
  const items = useCartItems();

  const { subtotal, itemCount } = useMemo(() => {
    const itemsArray = Object.values(items);
    const subtotal = itemsArray.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return { subtotal, itemCount: itemsArray.length };
  }, [items]);

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="border-t p-4">
      <div className="mb-4 flex justify-between text-lg font-semibold">
        <span>Разом:</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
};
