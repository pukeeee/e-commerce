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
