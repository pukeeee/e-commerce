import { unstable_cache } from "next/cache";

/**
 * Створює кешовану функцію з автоматичною інвалідацією за тегами.
 * Це обгортка над `unstable_cache` з `next/cache` для зручного використання.
 *
 * @param fn Асинхронна функція, результат якої потрібно кешувати.
 * @param keyParts Масив рядків, що формує унікальний ключ кешу.
 * @param options Опції кешування, такі як час ревалідації (revalidate) та теги (tags).
 */
export function createCachedFunction<
  T extends (...args: unknown[]) => Promise<unknown>,
>(
  fn: T,
  keyParts: string[],
  options: {
    revalidate?: number;
    tags?: string[];
  },
): T {
  return unstable_cache(fn, keyParts, options) as T;
}

/**
 * Об'єкт з функціями для генерації тегів кешу.
 * Дозволяє централізовано керувати іменами тегів для подальшої інвалідації.
 */
export const CACHE_TAGS = {
  products: "products",
  product: (id: string | number) => `product:${id}`,
  orders: "orders",
  order: (id: string | number) => `order:${id}`,
  categories: "categories",
  category: (slug: string) => `category:${slug}`,
} as const;
