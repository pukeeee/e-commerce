"use client";

import { useCart } from "@/entities/cart";
import { Button } from "@/shared/ui/button";

/**
 * @description Feature-компонент для повного очищення кошика.
 * Кнопка не відображається, якщо кошик порожній.
 */
export const ClearCartButton = () => {
  const clearCart = useCart((s) => s.clear);
  const items = useCart((s) => s.items);

  // Кнопка не потрібна, якщо об'єкт `items` порожній.
  if (Object.keys(items).length === 0) {
    return null;
  }

  return (
    <Button variant="outline" onClick={clearCart} className="w-full">
      Очистити
    </Button>
  );
};
