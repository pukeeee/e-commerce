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
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import type { CartItem, CartStoreState } from "./types";
import { CartItemSchema } from "./types";

/**
 * Створюємо безпечний для SSR об'єкт, що імітує API localStorage.
 * Він перевіряє, чи виконується код у браузері, перш ніж звертатися до `window`.
 */
const ssrSafeLocalStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof window === "undefined") {
        return null;
      }
      return window.localStorage.getItem(name);
    } catch (error) {
      console.error("Помилка читання з localStorage:", error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      window.localStorage.setItem(name, value);
    } catch (error) {
      console.error("Помилка запису в localStorage:", error);
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      window.localStorage.removeItem(name);
    } catch (error) {
      console.error("Помилка видалення з localStorage:", error);
    }
  },
};

export const createCartStore = () => {
  return create<CartStoreState>()(
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
        name: "cart-storage", // Ключ для localStorage
        // Використовуємо вбудований хелпер, який автоматично обробляє JSON
        // і використовує наш безпечний для SSR об'єкт сховища.
        storage: createJSONStorage(() => ssrSafeLocalStorage),
      },
    ),
  );
};

/**
 * @description Екземпляр хука `useCart`, готовий до використання в компонентах.
 */
export const useCart = createCartStore();
