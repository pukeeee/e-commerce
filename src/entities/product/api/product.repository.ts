import { DatabaseError, NotFoundError } from "@/shared/lib/errors/app-error";
import { createClient } from "@/shared/lib/supabase/server";
import type { Product } from "../model/types";
import type { IProductRepository } from "../model/interfaces";

// Проміжний тип для сирих даних з Supabase, оскільки поля в БД у snake_case
type RawProductType = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
};

/**
 * @function toCamelCase
 * @description Перетворює snake_case об'єкт з бази даних в camelCase для використання в додатку.
 */
const toCamelCase = (product: RawProductType): Product => ({
  id: product.id,
  createdAt: product.created_at,
  name: product.name,
  description: product.description ?? undefined,
  price: product.price,
  imageUrl: product.image_url ?? undefined,
  isActive: product.is_active,
});

/**
 * @class SupabaseProductRepository
 * @description Реалізація репозиторію товарів для роботи з Supabase.
 * @implements {IProductRepository}
 */
class SupabaseProductRepository implements IProductRepository {
  /**
   * @method getProducts
   * @description Отримує список усіх активних товарів з бази даних.
   */
  async getProducts(): Promise<Product[]> {
    const supabase = await createClient();

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new DatabaseError("Не вдалося завантажити товари.", {
        code: error.code,
        message: error.message,
        hint: error.hint,
      });
    }

    return products.map(toCamelCase);
  }

  /**
   * @method getById
   * @description Отримує один товар за його ID. Кидає помилку, якщо не знайдено.
   */
  async getById(id: string): Promise<Product> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Код PGRST116 означає, що запит не повернув жодного рядка.
        throw new NotFoundError("Товар");
      }
      throw new DatabaseError("Помилка при отриманні товару.", {
        code: error.code,
        message: error.message,
      });
    }

    return toCamelCase(data as RawProductType);
  }
}

export const productRepository = new SupabaseProductRepository();
