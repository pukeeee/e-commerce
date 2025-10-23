"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useTheme } from "@/shared/ui/theme";
import { useEffect, useState } from "react";

/**
 * @description
 * Кнопка для перемикання між світлою та темною темою.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Цей хук потрібен, щоб уникнути помилок гідратації,
  // оскільки тема на сервері може відрізнятися від клієнтської.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Визначаємо, яка тема активна на клієнті
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Поки компонент не змонтовано, показуємо "пустишку", щоб уникнути стрибка UI
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled className="h-9 w-9" />
    );
  }

  const toggleTheme = () => {
    // Просте перемикання між світлою та темною
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
