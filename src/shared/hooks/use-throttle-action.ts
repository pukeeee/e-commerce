import { useCallback, useRef } from "react";

/**
 * ✅ Reusable hook для throttling любых действий
 */
export function useThrottleAction<T extends (...args: unknown[]) => void>(
  action: T,
  delay: number,
) {
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledAction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedRef.current;

      // Если прошло достаточно времени - выполняем сразу
      if (timeSinceLastExecution >= delay) {
        lastExecutedRef.current = now;
        return action(...args);
      }

      // Иначе планируем выполнение
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastExecutedRef.current = Date.now();
        action(...args);
      }, delay - timeSinceLastExecution);
    },
    [action, delay],
  );

  return throttledAction;
}
