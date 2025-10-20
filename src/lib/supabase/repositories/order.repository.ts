import { createClient } from "@/lib/supabase/server";
import type { CreateOrderType } from "@/entities/order/model/types";

export const createOrderInDb = async (data: CreateOrderType) => {
  const supabase = await createClient();

  // Розділяємо товари та основні дані замовлення
  const { items, ...orderData } = data;

  const { data: newOrder, error } = await supabase
    .rpc("create_order_with_items", {
      ...orderData, // Передаємо основні дані
      items: items,   // Передаємо товари як JSON
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase RPC error:", error.message);
    throw new Error("Не вдалося створити замовлення в базі даних.");
  }

  return newOrder;
};
