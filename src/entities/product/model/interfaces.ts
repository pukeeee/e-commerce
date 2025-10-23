import { Product } from "./types";

/**
 * @description Інтерфейс для репозиторію товарів.
 * Репозиторій завжди працює з повними моделями, тому повертає `Product`.
 */
export interface IProductRepository {
  /**
   * @method getProducts
   * @description Отримує список усіх товарів.
   * @returns {Promise<Product[]>} Проміс, що повертає масив товарів.
   */
  getProducts(): Promise<Product[]>;

  /**
   * @method getById
   * @description Отримує товар за його унікальним ідентифікатором.
   * @param {string} id - Ідентифікатор товару.
   * @returns {Promise<Product>} Проміс, що повертає товар. Кидає помилку `NotFoundError`, якщо товар не знайдено.
   */
  getById(id: string): Promise<Product>;
}
