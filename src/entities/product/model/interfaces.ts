import { Product } from "./types";

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
