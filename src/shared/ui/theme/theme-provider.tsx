"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useThemeStore, type Theme } from "@/shared/lib/theme/useTheme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Створюємо контекст з початковим значенням undefined
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

/**
 * @description
 * Провайдер теми, який керує логікою зміни теми,
 * синхронізує її з DOM та системними налаштуваннями.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Отримуємо стан та функцію оновлення з нашого Zustand стору
  const { theme, setTheme } = useThemeStore();
  // Стан для уникнення помилок гідратації
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Якщо компонент ще не змонтовано, нічого не робимо
    if (!mounted) return;

    const root = window.document.documentElement;

    // Визначаємо, чи повинна бути темна тема
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", isDark);
  }, [theme, mounted]); // Запускаємо ефект при зміні теми або після монтування

  // Слухач для системної теми
  useEffect(() => {
    if (theme !== "system" || !mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      // Примусово оновлюємо клас, коли системна тема змінюється
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const value = { theme, setTheme };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * @description
 * Хук для доступу до стану теми та функції її зміни.
 * Повинен використовуватися всередині ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
