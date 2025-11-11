import { useCallback } from "react";
import { useCartStoreBase } from "./useCart";
import type { CartStoreState } from "./interfaces";
import { useShallow } from "zustand/react/shallow";

export function useCartItem(productId: string) {
  return useCartStoreBase(
    useShallow(
      useCallback(
        (state: CartStoreState) => ({
          quantity: state.items[productId]?.quantity ?? 0,
          addItem: state.addItem,
          increaseQuantity: state.increaseQuantity,
          decreaseQuantity: state.decreaseQuantity,
        }),
        [productId],
      ),
    ),
  );
}

/**
 * Повертає "сирий" об'єкт товарів у кошику.
 * Обчислення похідних даних (сума, кількість) мають виконуватися в компонентах з використанням useMemo.
 */
export function useCartItems() {
  return useCartStoreBase((state) => state.items);
}

// Для Badge
export function useCartCount() {
  return useCartStoreBase((state) => Object.keys(state.items).length);
}
