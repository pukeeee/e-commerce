import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @description Форматує число як ціну у гривнях.
 * @param {number} price - Ціна для форматування.
 * @returns {string} - Відформатований рядок ціни (наприклад, "1 250,50 ₴").
 */
export const formatPrice = (price: number): string => {
  const priceString = new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 2,
  }).format(price);

  // Замінюємо символ, який може відрізнятися, на гарантований 'грн'
  return priceString.replace("₴", "грн");
};
