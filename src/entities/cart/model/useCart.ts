/**
 * @file Керування станом кошика за допомогою Zustand.
 *
 * @summary
 * Цей файл реалізує стан кошика, що зберігається між сесіями.
 * - Використовує `Record<string, CartItem>` для миттєвого доступу до товарів (O(1)).
 * - Інтегрується з `localStorage` через middleware `persist` безпечним для SSR способом.
 * - Надає чіткий набір дій (actions) для маніпуляції кошиком.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "./types";
import type { CartStoreState } from "./interfaces";
import { CartItemSchema } from "./schemas";
import { ssrSafeLocalStorage } from "@/shared/lib/storage/ssr-safe-local-storage";

// Визначення стору залишається без змін
const useCartStoreBase = create<CartStoreState>()(
  persist(
    (set) => ({
      // --- State ---
      items: {},

      // --- Actions ---
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items[product.id];
          const newQuantity = (existingItem?.quantity || 0) + quantity;
          const validatedQuantity = Math.min(
            newQuantity,
            CartItemSchema.shape.quantity.maxValue || 50,
          );
          const newItem: CartItem = {
            ...product,
            quantity: validatedQuantity,
          };
          return { items: { ...state.items, [product.id]: newItem } };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          if (!state.items[productId]) return state;
          const items = { ...state.items };
          delete items[productId];
          return { items };
        });
      },
      increaseQuantity: (productId) => {
        set((state) => {
          const item = state.items[productId];
          if (!item) return state;
          const newQuantity = item.quantity + 1;
          const validatedQuantity = Math.min(
            newQuantity,
            CartItemSchema.shape.quantity.maxValue || 50,
          );
          return {
            items: {
              ...state.items,
              [productId]: { ...item, quantity: validatedQuantity },
            },
          };
        });
      },
      decreaseQuantity: (productId) => {
        set((state) => {
          const item = state.items[productId];
          if (!item) return state;
          const newQuantity = item.quantity - 1;
          if (newQuantity <= 0) {
            const items = { ...state.items };
            delete items[productId];
            return { items };
          }
          return {
            items: {
              ...state.items,
              [productId]: { ...item, quantity: newQuantity },
            },
          };
        });
      },
      clear: () => {
        set({ items: {} });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => ssrSafeLocalStorage),
    },
  ),
);

/**
 * Ідеальний SSR-safe хук для кошика.
 * Він просто є проксі до базового стору.
 * Безпека гарантується зовнішнім компонентом ClientOnly.
 */
export function useCart<T>(selector: (state: CartStoreState) => T): T {
  // Більше жодних useState та useEffect!
  return useCartStoreBase(selector);
}

// Експортуємо сам стор для окремих випадків
export { useCartStoreBase };
