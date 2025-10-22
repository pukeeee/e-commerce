/**
 * @file Допоміжні функції для сутності "Кошик".
 *
 * @summary
 * Цей файл містить чисті функції, які інкапсулюють бізнес-логіку,
 * пов'язану з кошиком. Винесення цієї логіки в окремі хелпери
 * дозволяє перевикористовувати її та спрощує тестування.
 */

import type { CartItem } from "./types";

/**
 * @description Обчислює загальну кількість товарів та їхню сумарну вартість у кошику.
 *
 * @param items Об'єкт з товарами в кошику (`Record<string, CartItem>`).
 *
 * @returns Об'єкт з `totalCount` (загальна кількість) та `totalPrice` (загальна вартість).
 *
 * @example
 * const items = {
 *   '1': { id: '1', name: 'Товар 1', price: 100, quantity: 2, imageUrl: '/images/product1.png' },
 *   '2': { id: '2', name: 'Товар 2', price: 50, quantity: 1, imageUrl: '/images/product2.png' },
 * };
 * const totals = calculateCartTotals(items);
 * // totals.totalCount === 3
 * // totals.totalPrice === 250
 */
export const calculateCartTotals = (items: Record<string, CartItem>) => {
  // Object.values() створює масив значень, що дозволяє нам використовувати методи масивів.
  const itemArray = Object.values(items);

  // Рахуємо загальну кількість, підсумовуючи `quantity` кожного товару.
  const totalCount = itemArray.reduce((sum, item) => sum + item.quantity, 0);

  // Рахуємо загальну вартість, підсумовуючи вартість кожної позиції (ціна * кількість).
  const totalPrice = itemArray.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { totalCount, totalPrice };
};
