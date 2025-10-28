import type { PostgrestError } from "@supabase/supabase-js";
import { DatabaseError, NotFoundError } from "./app-error";

export function handleSupabaseError(
  error: PostgrestError,
  context: { tableName: string; customMessage?: string },
): never {
  console.error(`Supabase error in table ${context.tableName}:`, error);

  if (error.code === "PGRST116") {
    throw new NotFoundError(context.tableName);
  }

  throw new DatabaseError(
    context.customMessage || `Помилка роботи з таблицею '${context.tableName}'`,
    { code: error.code, message: error.message },
  );
}
