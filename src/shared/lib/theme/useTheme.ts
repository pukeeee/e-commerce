import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
// Імпортуємо наш новий спільний модуль
import { ssrSafeLocalStorage } from "@/shared/lib/storage/ssr-safe-local-storage";

// Ключ для збереження теми в localStorage
const THEME_STORAGE_KEY = "theme-storage";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * @description
 * Хук для керування станом теми (світла, темна, системна).
 *
 * @summary
 * Стан теми зберігається в localStorage за допомогою middleware `persist`.
 * Використовує `ssrSafeLocalStorage` для уникнення помилок під час серверного рендерингу.
 *
 * @returns Поточна тема та функція для її зміни.
 *
 * @example
 * const { theme, setTheme } = useTheme();
 * setTheme("dark");
 */
export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (newTheme: Theme) => set({ theme: newTheme }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => ssrSafeLocalStorage),
    },
  ),
);
