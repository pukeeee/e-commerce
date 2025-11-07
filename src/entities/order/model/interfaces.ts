import { CreateOrderPayload, Order } from "./types";

/**
 * @interface IOrderRepository
 * @description Інтерфейс для репозиторію замовлень. Описує методи для взаємодії з джерелом даних.
 */
export interface IOrderRepository {
  /**
   * Створює нове замовлення.
   * @param data - Дані для створення замовлення.
   */
  create(data: CreateOrderPayload): Promise<Order>;

  /**
   * Отримує замовлення за його ID. Повертає null, якщо не знайдено.
   * @param id - Ідентифікатор замовлення.
   */
  getById(id: string): Promise<Order | null>;
}
