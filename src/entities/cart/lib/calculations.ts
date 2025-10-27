
import type { CartItem } from "../model/types";

/**
 * Застосовує промокод до вказаної суми.
 * @param code - Промокод.
 * @param amount - Сума, до якої застосовується знижка.
 * @returns Розмір знижки.
 */
function applyPromoCode(code: string, amount: number): number {
  // Тут буде логіка валідації та застосування промокодів.
  // Наприклад, запит до API або перевірка зі списку.
  // Поки що повертаємо фіксовану знижку для демонстрації.
  if (code.toUpperCase() === "SALE10") {
    console.log(`Застосовано промокод ${code}`);
    return amount * 0.1; // 10% знижка
  }
  return 0;
}

/**
 * Обчислює підсумки кошика: проміжну суму, знижку, загальну суму та кількість товарів.
 * @param items - Об'єкт з товарами в кошику.
 * @param promoCode - Необов'язковий промокод для застосування знижки.
 * @returns Об'єкт з розрахованими підсумками.
 */
export const calculateCartTotals = (
  items: Record<string, CartItem>,
  promoCode?: string,
) => {
  const itemsArray = Object.values(items);

  const subtotal = itemsArray.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Застосовуємо знижку, якщо є промокод
  const discount = promoCode ? applyPromoCode(promoCode, subtotal) : 0;

  // Загальна сума з урахуванням знижки
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    itemCount: itemsArray.reduce((sum, item) => sum + item.quantity, 0),
  };
};
