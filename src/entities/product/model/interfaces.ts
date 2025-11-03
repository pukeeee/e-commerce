import { Product } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";
import type { ProductFilters } from "./filter-types";

/**
 * @description Інтерфейс для репозиторію товарів (Контракт).
 * Визначає, які методи для роботи з даними товарів існують,
 * але не містить конкретної логіки їх виконання.
 * Це частина доменного шару, що дозволяє іншим частинам системи
 * (наприклад, фічам) залежати від абстракції, а не від реалізації.
 */
export interface IProductRepository {
  /**
   * @method getProducts
   * @description Отримує список усіх активних товарів.
   */
  getProducts(supabase: SupabaseClient): Promise<Product[]>;

  /**
   * @method getById
   * @description Отримує товар за його ID. Повертає null, якщо не знайдено.
   */
  getById(supabase: SupabaseClient, id: string): Promise<Product | null>;

  /**
   * @method getByIds
   * @description Отримує список товарів за їх ID.
   */
  getByIds(supabase: SupabaseClient, ids: string[]): Promise<Product[]>;

  getProductsFiltered(
    supabase: SupabaseClient,
    filters: ProductFilters,
  ): Promise<Product[]>;
}
