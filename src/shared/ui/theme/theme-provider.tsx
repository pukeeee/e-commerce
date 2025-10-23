"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/shared/lib/theme/useTheme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * @description
 * Компонент-провайдер, що керує логікою зміни теми.
 *
 * @summary
 * Цей компонент не передає дані через контекст, а виконує дві основні задачі:
 * 1. Синхронізує тему з DOM, додаючи або видаляючи клас 'dark' на `<html>`.
 * 2. Відстежує зміни системної теми (`prefers-color-scheme`) і оновлює вигляд,
 *    якщо обрано "системну" тему.
 *
 * Використовує хук `useTheme` (Zustand) для доступу до стану теми.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Отримуємо стан та функцію оновлення з нашого Zustand стору
  const { theme } = useTheme();
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

  // Слухач для автоматичної зміни теми, якщо обрано "системну".
  useEffect(() => {
    if (theme !== "system" || !mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  return <>{children}</>;
}
