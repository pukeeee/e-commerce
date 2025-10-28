# Корисні Хуки (Utility Hooks)

Цей документ описує кастомні React-хуки, створені для вирішення поширених завдань у проекті.

## 1. `useDebounce`

### Призначення

Хук `useDebounce` використовується для затримки оновлення якогось значення. Це надзвичайно корисно для оптимізації продуктивності, коли ви маєте справу з подіями, що виникають дуже часто, наприклад, введення тексту в полі пошуку.

Замість того, щоб реагувати на кожне натискання клавіші, ми чекаємо, доки користувач припинить друкувати, і лише після цього виконуємо "важку" операцію (наприклад, відправляємо запит на сервер).

### Як це працює

Хук використовує `useState` для зберігання "відкладеного" значення та `useEffect` для керування логікою затримки. Коли вхідне значення `value` змінюється, `useEffect` запускає `setTimeout`. Якщо протягом часу затримки `value` знову змінюється, попередній таймер скасовується (завдяки функції очищення `useEffect`), і запускається новий. Значення оновлюється лише тоді, коли таймер спрацьовує до кінця.

### Приклад використання

```tsx
import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';

function ProductSearch() {
  // Миттєве значення з поля вводу
  const [searchTerm, setSearchTerm] = useState('');

  // "Відкладене" значення, яке оновиться через 500 мс після зупинки вводу
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Цей ефект спрацює тільки при зміні `debouncedSearchTerm`
  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(`Шукаю товари: "${debouncedSearchTerm}"`);
      // Тут відбувається виклик API
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      placeholder="Пошук товарів..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

## 2. `useMediaQuery`

### Призначення

Хук `useMediaQuery` дозволяє реагувати на зміну розміру екрана та застосовувати логіку безпосередньо в React-компонентах. Це потужний інструмент для створення адаптивних інтерфейсів, коли простого CSS недостатньо і потрібно змінювати саму структуру JSX.

### Як це працює (SSR-Safety)

Цей хук створений з урахуванням серверного рендерингу (SSR) в Next.js, щоб уникнути помилок гідрації.

1.  Він використовує `window.matchMedia` для перевірки медіа-запиту.
2.  На сервері, де `window` не існує, хук завжди повертає `false`.
3.  На клієнті початковий стан також береться з `window.matchMedia`, щоб уникнути невідповідності між серверним та клієнтським рендером.
4.  `useEffect` підписується на подію `change`, щоб оновлювати стан, коли користувач змінює розмір вікна.

### Приклад використання

Найзручніше використовувати готові хуки-обгортки: `useIsMobile`, `useIsTablet`, `useIsDesktop`.

```tsx
import { useIsMobile } from '@/shared/hooks/use-media-query';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';

function Header() {
  // Хук поверне `true` або `false`
  const isMobile = useIsMobile();

  return (
    <header>
      <nav>
        {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
      </nav>
    </header>
  );
}
```

**Доступні хуки-обгортки:**
- `useIsMobile()`: `(max-width: 767.98px)`
- `useIsTablet()`: `(min-width: 768px) and (max-width: 1023.98px)`
- `useIsDesktop()`: `(min-width: 1024px)`
