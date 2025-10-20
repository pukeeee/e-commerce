import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/entities/product/model/types";

// Проміжний тип для сирих даних з Supabase
type RawProduct = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
};

// Функція для перетворення одного об'єкта
const toCamelCase = (product: RawProduct): Product => ({
  id: product.id,
  createdAt: product.created_at,
  name: product.name,
  description: product.description ?? undefined,
  price: product.price,
  imageUrl: product.image_url ?? undefined,
  isActive: product.is_active,
});

/**
 * Отримує список усіх активних товарів з бази даних.
 * @returns {Promise<Product[]>} Масив товарів.
 */
export const getProducts = async (): Promise<Product[]> => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*" as const) // as const для кращої типізації
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
    throw new Error("Не вдалося завантажити товари.");
  }

  // Перетворюємо snake_case з БД в camelCase для додатку
  return products.map(toCamelCase);
};
