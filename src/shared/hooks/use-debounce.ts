import { useState, useEffect } from "react";
import { DEBOUNCE } from "../config/constants";

/**
 * @name useDebounce
 * @description Хук, що повертає нове значення із затримкою.
 * Корисно для ситуацій, коли потрібно уникнути занадто частих оновлень,
 * наприклад, при введенні тексту в полі пошуку.
 *
 * @template T - Тип значення, що дебаунситься.
 * @param {T} value - Значення, яке потрібно оновити з затримкою.
 * @param {number} [delay] - Час затримки в мілісекундах.
 * @returns {T} - Значення, оновлене після затримки.
 */
export function useDebounce<T>(value: T, delay: number = DEBOUNCE.DELAY): T {
  // 1. Створюємо внутрішній стан, який буде зберігати "відкладене" значення.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. Кожного разу, коли `value` змінюється, ми запускаємо таймер.
    const handler = setTimeout(() => {
      // 3. Коли таймер спрацює (через `delay` мс), ми оновлюємо наш внутрішній стан.
      setDebouncedValue(value);
    }, delay);

    // 4. Функція очищення. Це найважливіша частина!
    //    React викличе її, якщо `value` знову зміниться до того, як спрацює таймер.
    //    Вона скасовує попередній таймер, не даючи йому оновити стан.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Ефект перезапускається, якщо змінюється саме значення або затримка.

  // 5. Компонент, що використовує хук, отримує це "відкладене" значення.
  return debouncedValue;
}
