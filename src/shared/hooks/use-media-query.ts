import { useState, useEffect } from "react";

/**
 * @name useMediaQuery
 * @description Хук для відстеження медіа-запитів CSS, безпечний для SSR.
 * @param {string} query - Рядок медіа-запиту (наприклад, '(max-width: 768px)').
 * @returns {boolean} - Повертає `true`, якщо медіа-запит відповідає, інакше `false`.
 */
export function useMediaQuery(query: string): boolean {
  // 1. Перевіряємо, чи виконується код на сервері.
  //    На сервері `window` не існує, тому `typeof window` буде 'undefined'.
  const isSsr = typeof window === "undefined";

  // 2. Функція для отримання початкового стану.
  //    - На сервері: завжди повертає `false`.
  //    - На клієнті: миттєво перевіряє, чи відповідає запит поточному розміру екрана.
  //    Це запобігає невідповідності між тим, що відрендерив сервер, і тим, що бачить клієнт.
  const getInitialState = (): boolean => {
    return isSsr ? false : window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getInitialState);

  useEffect(() => {
    // 3. Якщо ми на сервері, ефект не потрібен, просто виходимо.
    if (isSsr) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // 4. Обробник, який буде оновлювати стан при зміні розміру вікна.
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 5. Додаємо слухача.
    mediaQueryList.addEventListener("change", listener);

    // 6. Функція очищення, яка видаляє слухача, коли компонент зникає.
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query, isSsr]); // Ефект залежить тільки від самого запиту.

  return matches;
}

// --- Готові хуки для поширених брейкпоінтів ---
// Це просто зручні обгортки над основним хуком для чистоти коду.

/**
 * @description Перевіряє, чи є поточний розмір екрану мобільним (< 768px).
 */
export const useIsMobile = () => useMediaQuery("(max-width: 767.98px)");

/**
 * @description Перевіряє, чи є поточний розмір екрану планшетним (≥ 768px та < 1024px).
 */
export const useIsTablet = () =>
  useMediaQuery("(min-width: 768px) and (max-width: 1023.98px)");

/**
 * @description Перевіряє, чи є поточний розмір екрану десктопним (≥ 1024px).
 */
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
