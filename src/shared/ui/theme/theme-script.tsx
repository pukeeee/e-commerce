/**
 * @description
 * Інлайн-скрипт, що виконується ДО рендерингу сторінки.
 * Запобігає мерехтінню теми (FOUC) при завантаженні.
 * Читає збережену тему з localStorage та негайно застосовує її.
 */
export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        // Отримуємо збережений стан зі сховища
        const storedTheme = localStorage.getItem('theme-storage');
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
