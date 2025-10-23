"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useTheme } from "@/shared/lib/theme/useTheme";
import { useEffect, useState } from "react";

/**
 * @description
 * Кнопка для перемикання між світлою та темною темою.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Хук `useEffect` гарантує, що код для визначення теми
  // виконається лише на клієнті, після монтування компонента.
  // Це запобігає помилкам гідратації (hydration mismatch),
  // оскільки тема на сервері (завжди 'system') може відрізнятися
  // від збереженої в localStorage на клієнті.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Поки компонент не змонтовано, ми не можемо знати правильну тему.
  // Щоб уникнути стрибка інтерфейсу (напр. іконка місяця змінюється на сонце),
  // рендеримо неактивну "пустишку".
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled className="h-9 w-9" />
    );
  }

  // Визначаємо, чи є поточною тема темною.
  // Враховуємо як прямий вибір 'dark', так і системне налаштування.
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

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
