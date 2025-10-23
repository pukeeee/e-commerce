import type { StateStorage } from "zustand/middleware";

/**
 * @file Безпечний для SSR об'єкт-обгортка над localStorage.
 *
 * @summary
 * Цей модуль надає реалізацію `StateStorage` для Zustand,
 * яка перевіряє наявність `window` перед доступом до `localStorage`.
 * Це запобігає помилкам під час серверного рендерингу (SSR) в Next.js.
 *
 * Обробляє можливі помилки, що виникають, коли localStorage недоступний
 * (наприклад, в режимі інкогніто в деяких браузерах).
 */
export const ssrSafeLocalStorage: StateStorage = {
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
