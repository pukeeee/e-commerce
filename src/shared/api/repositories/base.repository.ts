import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { DatabaseError, NotFoundError } from "@/shared/lib/errors/app-error";

/**
 * @class BaseRepository
 * @description Базовий клас для всіх репозиторіїв, що інкапсулює спільну логіку
 * для роботи з базою даних через Supabase.
 * @template EntityType - Тип чистої бізнес-сутності (camelCase).
 * @template RawType - Тип "сирих" даних з БД (snake_case).
 */
export abstract class BaseRepository<EntityType, RawType> {
  /**
   * @protected
   * @abstract
   * @property {string} tableName - Назва таблиці в базі даних.
   */
  protected abstract tableName: string;

  /**
   * @constructor
   * @param {SupabaseClient} supabase - Екземпляр клієнта Supabase.
   */
  constructor(protected supabase: SupabaseClient) {}

  /**
   * @protected
   * @abstract
   * @method toCamelCase
   * @description Абстрактний метод для перетворення об'єкта з snake_case (БД) в camelCase (додаток).
   * @param {any} raw - "Сирий" об'єкт з бази даних.
   * @returns {T} - Об'єкт сутності.
   */
  protected abstract toCamelCase(raw: RawType): EntityType;

  /**
   * @protected
   * @method handleError
   * @description Централізований обробник помилок від Supabase.
   * @param {any} error - Об'єкт помилки.
   * @param {string} [customMessage] - Опціональне повідомлення про помилку.
   * @throws {NotFoundError | DatabaseError} - Кидає типізовану помилку.
   */
  protected handleError(error: PostgrestError, customMessage?: string): never {
    // Код PGRST116 означає, що запит .single() не повернув жодного рядка.
    if (error.code === "PGRST116") {
      throw new NotFoundError(this.tableName);
    }
    // В інших випадках кидаємо загальну помилку бази даних.
    throw new DatabaseError(
      customMessage || `Помилка роботи з таблицею '${this.tableName}'`,
      { code: error.code, message: error.message },
    );
  }
}
