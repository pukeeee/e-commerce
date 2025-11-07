/**
 * @file Керування станом кошика за допомогою Zustand.
 *
 * @summary
 * Цей файл реалізує стан кошика, що зберігається між сесіями.
 * - Використовує `Record<string, CartItem>` для миттєвого доступу до товарів (O(1)).
 * - Інтегрується з `localStorage` через middleware `persist` безпечним для SSR способом.
 * - Надає чіткий набір дій (actions) для маніпуляції кошиком.
 * - Реалізує безшовну гідрацію без потреби в ClientOnly.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem } from "./types";
import type { CartStoreState } from "./interfaces";
import { CartItemSchema } from "./schemas";
import { syncCartWithProducts } from "../lib/cart-sync";

const useCartStoreBase = create(
  persist<CartStoreState>(
    (set, get) => ({
      // --- State ---
      items: {},
      isHydrated: false, // ✅ Додаємо флаг гідрації

      // --- Actions ---
      _hasHydrated: () => {
        set({ isHydrated: true });
      },

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
      syncWithServer: async (actualProducts) => {
        // Використовуємо `get()` для доступу до поточного стану без підписки на зміни
        const currentItems = get().items;
        const result = syncCartWithProducts(currentItems, actualProducts);

        // Оновлюємо стан, тільки якщо були реальні зміни
        if (result.hasChanges) {
          set({ items: result.syncedItems });
        }

        // Повертаємо інформацію про зміни для UI (наприклад, для показу сповіщень)
        return {
          removedItems: result.removedItems,
          updatedItems: result.updatedItems,
        };
      },
      clear: () => {
        set({ items: {} });
      },
    }),
    {
      name: "cart-storage",
      // ✅ Використовуємо звичайний localStorage - він вже безпечний в persist
      storage: createJSONStorage(() => localStorage),
      // ✅ Викликаємо _hasHydrated коли стан відновлено
      onRehydrateStorage: () => (state) => {
        state?._hasHydrated();
      },
    },
  ),
);

/**
 * ✅ Hook який повертає коректне стан до гідрації
 */
export function useCart<T>(selector: (state: CartStoreState) => T): T {
  return useCartStoreBase(selector);
}

// Експортуємо сам стор для окремих випадків
export { useCartStoreBase };
