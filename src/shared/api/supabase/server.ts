import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Створює серверний клієнт Supabase.
 * Ця функція не кешується і призначена для використання в Server Actions,
 * де потрібен новий екземпляр клієнта для кожної операції.
 * Next.js автоматично мемоїзує виклик cookies() в межах одного запиту.
 */
export async function createClient() {
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
}
