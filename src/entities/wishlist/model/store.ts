/**
 * @file Керування станом списку бажань (wishlist) за допомогою Zustand.
 *
 * @summary
 * Цей файл реалізує стан списку бажань, що зберігається між сесіями в localStorage.
 * - Зберігає лише ID товарів для ефективності.
 * - Використовує `persist` middleware для синхронізації з localStorage.
 * - Реалізує механізм гідрації для безпечної роботи в Next.js (SSR).
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { WishlistStoreState } from "./types";

const useWishlistStoreBase = create(
  persist<WishlistStoreState>(
    (set) => ({
      // --- State ---
      productIds: [],
      isHydrated: false,

      // --- Actions ---
      _hasHydrated: () => {
        set({ isHydrated: true });
      },

            toggleItem: (productId) => {

              set((state) => {

                const hasItem = state.productIds.includes(productId);

                if (hasItem) {

                  // Видалити елемент

                  return {

                    productIds: state.productIds.filter((id) => id !== productId),

                  };

                } else {

                  // Додати елемент

                  return { productIds: [...state.productIds, productId] };

                }

              });

            },

      

            clear: () => {

              set({ productIds: [] });

            },

          }),

          {

            name: "wishlist-storage", // Унікальний ключ для localStorage

            storage: createJSONStorage(() => localStorage),

            onRehydrateStorage: () => (state) => {

              state?._hasHydrated();

            },

          },

        ),

      );

      

      /**

       * Хук для доступу до стану списку бажань.

       * Забезпечує правильну роботу до моменту гідрації.

       * @param selector Функція-селектор для вибору частини стану.

       */

      export function useWishlist<T>(selector: (state: WishlistStoreState) => T): T {

        const store = useWishlistStoreBase(selector);

        // До гідрації повертаємо початковий стан, щоб уникнути помилок

        const isHydrated = useWishlistStoreBase((state) => state.isHydrated);

        if (!isHydrated) {

          return selector({

            productIds: [],

            isHydrated: false,

            toggleItem: () => {},

            clear: () => {},

            _hasHydrated: () => {},

          });

        }

        return store;

      }

      

      /**

       * Хук для перевірки, чи є товар у списку бажань.

       * @param productId ID товару.

       */

      export const useIsFavorite = (productId: string) => {

        return useWishlist((state) => state.productIds.includes(productId));

      };

      

      /**

       * Хук для отримання дії toggleItem.

       */

      export const useToggleFavorite = () => {

        return useWishlist((state) => state.toggleItem);

      };

      

      /**

       * Хук для отримання дії clear.

       */

      export const useClearWishlist = () => {

        return useWishlist((state) => state.clear);

      };

      

      

      // Експортуємо сам стор для окремих випадків

      export { useWishlistStoreBase };

// Синхронізація між вкладками браузера
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === useWishlistStoreBase.persist.getOptions().name) {
      useWishlistStoreBase.persist.rehydrate();
    }
  });
}
