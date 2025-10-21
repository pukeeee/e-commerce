import { createClient } from "@/shared/lib/supabase/server";
import { IProductRepository, type Product } from "../model/types";

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
 * @param {RawProductType} product - Об'єкт товару з бази даних.
 * @returns {ProductType} Об'єкт товару в форматі camelCase.
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
   * @returns {Promise<ProductType[]>} Масив товарів.
   */
  async getProducts(): Promise<Product[]> {
    const supabase = await createClient();

    const { data: products, error } = await supabase
      .from("products")
      .select("*" as const)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.message);
      throw new Error("Не вдалося завантажити товари.");
    }

    return products.map(toCamelCase);
  }

  /**
   * @method getById
   * @description Отримує один товар за його ID.
   * @param {string} id - Ідентифікатор товару.
   * @returns {Promise<ProductType | null>} Товар або null, якщо не знайдено.
   */
  async getById(id: string): Promise<Product | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return null;
    }

    return toCamelCase(data as RawProductType);
  }
}

export const productRepository = new SupabaseProductRepository();
