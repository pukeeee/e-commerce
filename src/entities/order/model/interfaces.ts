import { CreateOrderPayload, Order } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * @interface IOrderRepository
 * @description Інтерфейс для репозиторію замовлень. Описує методи для взаємодії з джерелом даних.
 */
export interface IOrderRepository {
  /**
   * Створює нове замовлення.
   * @param data - Дані для створення замовлення.
   */
  create(supabase: SupabaseClient, data: CreateOrderPayload): Promise<Order>;

  /**
   * Отримує замовлення за його ID. Повертає null, якщо не знайдено.
   * @param id - Ідентифікатор замовлення.
   */
  getById(supabase: SupabaseClient, id: string): Promise<Order | null>;
}
