import { useCartStoreBase } from "./useCart";

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
