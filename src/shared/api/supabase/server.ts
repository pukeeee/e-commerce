import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

/**
 * Створює мемоїзований (кешований) серверний клієнт Supabase для використання
 * в серверних компонентах React.
 *
 * Завдяки `React.cache`, функція `createServerClient` буде викликана лише один раз
 * протягом одного серверного рендеру, а всі наступні виклики `createClient`
 * в межах того ж запиту повертатимуть той самий екземпляр клієнта.
 * Це значно підвищує продуктивність та запобігає зайвим з'єднанням з БД.
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Цей блок може спрацювати в Server Component, якщо middleware
            // для оновлення сесії не налаштовано. Можна ігнорувати.
          }
        },
      },
    },
  );
});
