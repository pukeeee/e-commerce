import { OrderItem } from "./types";

/**
 * Обчислює загальну кількість товарів у замовленні.
 * @param order - Об'єкт замовлення.
 * @returns Загальна кількість товарів.
 */
export function getTotalItemCount(order: { items: OrderItem[] }): number {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Перевіряє, чи має замовлення право на безкоштовну доставку (прикладна логіка).
 * @param order - Об'єкт замовлення.
 * @returns True, якщо загальна сума замовлення перевищує певну суму.
 */
export function isEligibleForFreeShipping(order: {
  totalAmount: number;
}): boolean {
  const freeShippingThreshold = 2000;
  return order.totalAmount >= freeShippingThreshold;
}
