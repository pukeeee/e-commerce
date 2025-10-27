import { Product } from "./types";

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
   * @returns {Promise<Product[]>} Проміс, що повертає масив товарів.
   */
  getProducts(): Promise<Product[]>;

  /**
   * @method getById
   * @description Отримує товар за його унікальним ідентифікатором.
   * @param {string} id - Ідентифікатор товару.
   * @returns {Promise<Product>} Проміс, що повертає товар.
   */
  getById(id: string): Promise<Product>;
}
