import { useMemo } from "react";
import { useCartStoreBase } from "@/entities/cart";
import { useShallow } from "zustand/react/shallow";
import type { PublicProduct } from "@/entities/product";

/**
 * Централізований хук для роботи з товаром у кошику.
 * Оптимізовано для уникнення зайвих ре-рендерів.
 */
export function useCartItem(productId: string) {
  // Крок 1: Вибираємо дані та дії зі стору.
  // Виправлено помилку нескінченного циклу рендерінгу:
  // Замість створення нового об'єкту `actions` в селекторі на кожен рендер,
  // ми тепер вибираємо кожну функцію окремо. `useShallow` може правильно
  // порівняти ці функції (які є стабільними) і запобігти зайвим оновленням.
  const {
    item,
    isHydrated,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStoreBase(
    useShallow((state) => ({
      item: state.items[productId],
      isHydrated: state.isHydrated,
      addItem: state.addItem,
      removeItem: state.removeItem,
      increaseQuantity: state.increaseQuantity,
      decreaseQuantity: state.decreaseQuantity,
    })),
  );

  // Крок 2: Створюємо мемоізовані "зв'язані" дії.
  const boundActions = useMemo(
    () => ({
      addToCart: (product: Omit<PublicProduct, "quantity">) => {
        addItem(product, 1);
      },
      increase: () => {
        increaseQuantity(productId);
      },
      decrease: () => {
        decreaseQuantity(productId);
      },
      remove: () => {
        removeItem(productId);
      },
      setQuantity: (qty: number) => {
        // Використання `getState()` тут було б помилкою, бо компонент не підписується на зміни.
        // Замість цього використовуємо `item`, отриманий з хука, який вже підписаний на оновлення.
        if (!item) return;

        if (qty <= 0) {
          removeItem(productId);
        } else {
          const currentQuantity = item.quantity;
          const diff = qty - currentQuantity;
          if (diff !== 0) {
            // `addItem` обробляє як додавання, так і віднімання кількості.
            addItem(item, diff);
          }
        }
      },
    }),
    // Додаємо `item` у залежності, оскільки він використовується в `setQuantity`
    [addItem, removeItem, increaseQuantity, decreaseQuantity, productId, item],
  );

  // Крок 3: Мемоізуємо фінальний об'єкт, щоб він не створювався на кожен рендер.
  const result = useMemo(
    () => ({
      quantity: item?.quantity ?? 0,
      isInCart: !!item,
      item,
      isHydrated,
      ...boundActions,
    }),
    [item, isHydrated, boundActions],
  );

  return result;
}

/**
 * Хук для глобальних операцій з кошиком.
 */
export function useCartActions() {
  return useCartStoreBase(
    useShallow((state) => ({
      clear: state.clear,
      itemCount: Object.keys(state.items).length,
      totalItems: Object.values(state.items).reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
      isHydrated: state.isHydrated,
    })),
  );
}
