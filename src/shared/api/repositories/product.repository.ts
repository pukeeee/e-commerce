import { createClient } from "@/shared/api/supabase/server";
import type { Product, IProductRepository } from "@/entities/product";
import { cache } from "react";
import { BaseRepository } from "./base.repository";

// Проміжний тип для сирих даних з Supabase, оскільки поля в БД у snake_case
type RawProduct = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
};

/**
 * @class SupabaseProductRepository
 * @description Реалізація репозиторію товарів для роботи з Supabase.
 * @implements {IProductRepository}
 */
class SupabaseProductRepository
  extends BaseRepository<Product, RawProduct>
  implements IProductRepository
{
  protected tableName = "products";

  protected toCamelCase(raw: RawProduct): Product {
    return {
      id: raw.id,
      createdAt: raw.created_at,
      name: raw.name,
      description: raw.description ?? undefined,
      price: raw.price,
      imageUrl: raw.image_url ?? undefined,
      isActive: raw.is_active,
    };
  }

  /**
   * @method getProducts
   * @description Отримує список усіх активних товарів з бази даних.
   */
  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) this.handleError(error, "Не вдалося завантажити товари");

    // .bind(this) потрібен, щоб метод toCamelCase не втратив свій контекст (this)
    return data.map(this.toCamelCase.bind(this));
  }

  /**
   * @method getById
   * @description Отримує один товар за його ID. Кидає помилку, якщо не знайдено.
   */
  async getById(id: string): Promise<Product> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) this.handleError(error);
    return this.toCamelCase(data);
  }
}

// Фабрика для створення репозиторію.
// Вона асинхронна, бо createClient() асинхронний.
const createRepo = async () => {
  const supabase = await createClient();
  return new SupabaseProductRepository(supabase);
};

// Кешований getter. Це те, що буде використовуватись у додатку.
// cache() гарантує, що createRepo() виконається лише один раз за запит.
export const getProductRepository = cache(createRepo);
