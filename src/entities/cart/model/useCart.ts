/**
 * @file Керування станом кошика за допомогою Zustand.
 *
 * @summary
 * Цей файл реалізує повний життєвий цикл стану кошика:
 * - Використовує `Record<string, CartItem>` для миттєвого доступу до товарів (O(1)).
 * - Інтегрується з `localStorage` через middleware `persist` для збереження стану між сесіями.
 * - Надає чіткий набір дій (actions) для маніпуляції кошиком.
 * - Створений за допомогою фабричної функції для покращення тестування (dependency injection).
 */

import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import { createLocalStorageAdapter, type StorageAdapter } from "../lib/storage";
import type { CartItem, CartStoreState } from "./types";
import { CartItemSchema } from "./types";
import { calculateCartTotals } from "./helpers";

/**
 * @description Фабрична функція для створення стану кошика.
 * Використання фабрики дозволяє інжектувати залежності (наприклад, `storageAdapter`),
 * що робить код більш гнучким та легким для тестування.
 * @param storageAdapter Адаптер для взаємодії з будь-яким key-value сховищем.
 */
export const createCartStore = (storageAdapter: StorageAdapter) => {
  type PersistedState = Pick<CartStoreState, "items">;

  return create<CartStoreState>()(
    persist(
      (set) => ({
        // --- State ---
        items: {},

        // --- Computed State ---
        totalCount: 0,
        totalPrice: 0,

        // --- Actions ---
        addItem: (product, quantity = 1) => {
          set((state) => {
            const existingItem = state.items[product.id];
            const newQuantity = (existingItem?.quantity || 0) + quantity;

            // Валідація кількості за допомогою Zod-схеми
            const validatedQuantity = Math.min(
              newQuantity,
              CartItemSchema.shape.quantity.maxValue || 50,
            );

            const newItem: CartItem = {
              ...product,
              quantity: validatedQuantity,
            };

            const items = { ...state.items, [product.id]: newItem };
            const totals = calculateCartTotals(items);

            return { items, ...totals };
          });
        },

        removeItem: (productId) => {
          set((state) => {
            if (!state.items[productId]) {
              return state; // Якщо товару немає, нічого не змінюємо
            }
            // Створюємо копію об'єкта, щоб гарантувати імутабельність
            const items = { ...state.items };
            delete items[productId];
            const totals = calculateCartTotals(items);

            return { items, ...totals };
          });
        },

        increaseQuantity: (productId) => {
          set((state) => {
            const item = state.items[productId];
            if (!item) {
              return state; // Гарантуємо, що не будемо змінювати стан, якщо товару немає
            }

            const newQuantity = item.quantity + 1;
            const validatedQuantity = Math.min(
              newQuantity,
              CartItemSchema.shape.quantity.maxValue || 50,
            );

            const items = {
              ...state.items,
              [productId]: { ...item, quantity: validatedQuantity },
            };

            const totals = calculateCartTotals(items);
            return { items, ...totals };
          });
        },

        decreaseQuantity: (productId) => {
          set((state) => {
            const item = state.items[productId];
            if (!item) {
              return state;
            }

            const newQuantity = item.quantity - 1;

            if (newQuantity <= 0) {
              const items = { ...state.items };
              delete items[productId];
              const totals = calculateCartTotals(items);
              return { items, ...totals };
            }

            const items = {
              ...state.items,
              [productId]: { ...item, quantity: newQuantity },
            };
            const totals = calculateCartTotals(items);
            return { items, ...totals };
          });
        },

        clear: () => {
          set({ items: {}, totalCount: 0, totalPrice: 0 });
        },
      }),
      {
        name: storageAdapter.key,

        storage: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          getItem: (_name) => {
            const value = storageAdapter.read();
            return value as StorageValue<PersistedState> | null;
          },
          setItem: (_name, value) => {
            storageAdapter.write(value);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          removeItem: (_name) => {
            storageAdapter.write(null);
          },
        },

        // Зберігаємо лише `items`, оскільки `totalCount` і `totalPrice` є обчислюваними
        // і будуть відновлені при завантаженні.
        partialize: (state) => ({ items: state.items }),

        // Цей хук викликається після завантаження стану зі сховища (rehydration).
        // Він потрібен, щоб ініціалізувати обчислювані поля.
        onRehydrateStorage: (state) => {
          if (state) {
            const totals = calculateCartTotals(state.items);
            state.totalCount = totals.totalCount;
            state.totalPrice = totals.totalPrice;
          }
        },
      },
    ),
  );
};

/**
 * @description Екземпляр хука `useCart`, готовий до використання в компонентах.
 * Створений з конфігурацією для `localStorage` за замовчуванням.
 */
export const useCart = createCartStore(
  createLocalStorageAdapter("cart-storage"),
);
