import { z } from "zod";

// =================================================================
// ZOD SCHEMAS
// =================================================================

/**
 * @description Повна схема товару, що відповідає запису в базі даних.
 * Це внутрішня модель, яка використовується на сервері.
 */
export const ProductSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .min(3, "Назва товару має містити принаймні 3 символи")
    .max(200, "Назва товару занадто довга")
    .trim(),
  description: z
    .string()
    .max(2000, "Опис товару занадто довгий")
    .trim()
    .optional()
    .or(z.literal("")),
  price: z
    .number()
    .positive("Ціна має бути позитивним числом")
    .max(10_000_000, "Ціна занадто велика")
    .multipleOf(0.01, "Ціна може мати максимум 2 знаки після коми"),
  imageUrl: z.url("Неправильний формат URL зображення").optional(),
  isActive: z.boolean().default(true),
  createdAt: z.iso.datetime(),
});

/**
 * @description Публічна схема товару.
 * Містить лише ті поля, які безпечно віддавати на клієнт для відображення покупцеві.
 */
export const PublicProductSchema = ProductSchema.pick({
  id: true,
  name: true,
  description: true,
  price: true,
  imageUrl: true,
});
// =================================================================
// TYPES
// =================================================================

/**
 * @description Повний тип товару для внутрішнього використання (сервер, репозиторій).
 */
export type Product = z.infer<typeof ProductSchema>;

/**
 * @description Публічний тип товару для відображення на клієнті.
 */
export type PublicProduct = z.infer<typeof PublicProductSchema>;
// =================================================================
// REPOSITORY INTERFACE
// =================================================================

/**
 * @description Інтерфейс для репозиторію товарів.
 * Репозиторій завжди працює з повними моделями, тому повертає `Product`.
 */
export interface IProductRepository {
  /**
   * @method getProducts
   * @description Отримує список усіх товарів.
   * @returns {Promise<ProductType[]>} Проміс, що повертає масив товарів.
   */
  getProducts(): Promise<Product[]>;

  /**
   * @method getById
   * @description Отримує товар за його унікальним ідентифікатором.
   * @param {string} id - Ідентифікатор товару.
   * @returns {Promise<ProductType | null>} Проміс, що повертає товар або null, якщо товар не знайдено.
   */
  getById(id: string): Promise<Product | null>;
}
