"use server";

import { productRepository } from "@/shared/api/repositories/product.repository";
import type { Product } from "@/entities/product";

/**
 * Виконує повнотекстовий пошук товарів за назвою.
 * @param query Рядок для пошуку.
 * @returns Масив знайдених товарів.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  // Якщо запит порожній, повертаємо порожній масив
  if (!query.trim()) {
    return [];
  }

  // Використовуємо існуючий метод репозиторію, але без фільтрації за категорією
  const products = await productRepository.getProductsFiltered({
    search: query,
    sort: "newest", // Сортування за замовчуванням для результатів пошуку
  });

  return products;
}
