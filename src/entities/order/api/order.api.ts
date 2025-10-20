import { createOrderInDb } from "@/lib/supabase/repositories/order.repository";
import type { CreateOrderType } from "../model/types";

// Цей об'єкт є публічним API для роботи з даними сутності Order
export const orderApi = {
  /**
   * Створює нове замовлення.
   * Інкапсулює логіку виклику репозиторію.
   */
  create: async (data: CreateOrderType) => {
    // В майбутньому тут може бути логіка кешування, логування тощо.
    const newOrder = await createOrderInDb(data);
    return newOrder;
  },

  // Тут можуть бути інші методи: getById, update, delete і т.д.
  // getById: async (id: string) => { ... }
};
