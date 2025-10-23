import { createClient } from "@/shared/lib/supabase/server";
import type { CreateOrderPayload, Order } from "@/entities/order/model/types";
import type { IOrderRepository } from "../model/interfaces";

class SupabaseOrderRepository implements IOrderRepository {
  async create(data: CreateOrderPayload): Promise<Order> {
    const supabase = await createClient();
    const { items, ...orderData } = data;

    const { data: newOrder, error } = await supabase
      .rpc("create_order_with_items", {
        ...orderData,
        items: items,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase RPC error:", error.message);
      throw new Error("Не вдалося створити замовлення в базі даних.");
    }

    return newOrder as Order;
  }

  async getById(id: string): Promise<Order | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }
}

export const orderRepository = new SupabaseOrderRepository();
