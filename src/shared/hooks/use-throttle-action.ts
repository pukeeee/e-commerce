import { useCallback, useRef } from "react";

/**
 * ✅ Reusable hook для throttling, що використовує sessionStorage для
 * збереження стану між перезавантаженнями сторінки.
 * @param key - Унікальний ключ для зберігання стану в sessionStorage.
 * @param action - Функція, яку потрібно "загальмувати".
 * @param delay - Інтервал затримки в мілісекундах.
 */
export function useThrottleAction<T extends (...args: unknown[]) => void>(
  key: string,
  action: T,
  delay: number,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getSessionLastExecuted = useCallback(() => {
    const item = sessionStorage.getItem(key);
    return item ? parseInt(item, 10) : 0;
  }, [key]);

  const setSessionLastExecuted = useCallback(
    (time: number) => {
      sessionStorage.setItem(key, time.toString());
    },
    [key],
  );

  const throttledAction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const lastExecuted = getSessionLastExecuted();
      const timeSinceLastExecution = now - lastExecuted;

      // Якщо пройшло достатньо часу - виконуємо відразу
      if (timeSinceLastExecution >= delay) {
        setSessionLastExecuted(now);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        return action(...args);
      }

      // Інакше плануємо виконання, якщо ще немає запланованого
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          const newNow = Date.now();
          setSessionLastExecuted(newNow);
          timeoutRef.current = null;
          action(...args);
        }, delay - timeSinceLastExecution);
      }
    },
    [action, delay, getSessionLastExecuted, setSessionLastExecuted],
  );

  return throttledAction;
}
