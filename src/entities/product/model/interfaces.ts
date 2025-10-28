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
   */
  getProducts(): Promise<Product[]>;

  /**
   * @method getById
   * @description Отримує товар за його ID. Повертає null, якщо не знайдено.
   */
  getById(id: string): Promise<Product | null>;

  /**
   * @method getByIds
   * @description Отримує список товарів за їх ID.
   */
  getByIds(ids: string[]): Promise<Product[]>;
}
