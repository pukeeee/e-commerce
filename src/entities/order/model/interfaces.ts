import { CreateOrderPayload, Order } from "./types";

/**
 * @interface IOrderRepository
 * @description Інтерфейс для репозиторію замовлень. Описує методи для взаємодії з джерелом даних.
 */
export interface IOrderRepository {
  /**
   * Створює нове замовлення.
   * @param data - Дані для створення замовлення.
   * @returns {Promise<Order>} Створене замовлення.
   */
  create(data: CreateOrderPayload): Promise<Order>;

  /**
   * Отримує замовлення за його ID разом з усіма товарами.
   * @param id - Ідентифікатор замовлення.
   * @returns {Promise<Order>} Замовлення. Кидає помилку `NotFoundError`, якщо не знайдено.
   */
  getById(id: string): Promise<Order>;
}
