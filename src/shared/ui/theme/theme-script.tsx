/**
 * @description
 * Інлайн-скрипт, що виконується ДО рендерингу сторінки на клієнті.
 *
 * @summary
 * Його головна мета — запобігти "мерехтінню" (FOUC - Flash of Unstyled Content),
 * коли сторінка спочатку рендериться у світлій темі, а потім перемикається на темну.
 *
 * Скрипт читає збережену тему з `localStorage` і негайно застосовує клас 'dark'
 * до `<html>`, ще до того, як React почне процес гідратації.
 */
export function ThemeScript() {
  // Ключ має збігатися з тим, що використовується в `useTheme` (Zustand persist).
  const themeStorageKey = "theme-storage";

  const themeScript = `
    (function() {
      try {
        // Отримуємо збережений стан зі сховища
        const storedTheme = localStorage.getItem('${themeStorageKey}');
        // Парсимо JSON і дістаємо стан теми, або використовуємо 'system' як запасний варіант
        const theme = storedTheme ? JSON.parse(storedTheme).state.theme : 'system';

        const isDark = theme === 'dark' ||
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        // Додаємо або видаляємо клас 'dark' на кореневому елементі <html>
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        // Якщо сталася помилка, повертаємося до перевірки системних налаштувань
        console.warn('Could not apply theme from localStorage', e);
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
      }
    })();
  `;

  return (
    <script
      id="theme-script"
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
