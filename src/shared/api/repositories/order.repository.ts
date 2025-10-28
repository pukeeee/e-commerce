import { createClient } from "@/shared/api/supabase/server";
import type {
  CreateOrderPayload,
  Order,
  OrderItem,
  PaymentMethod,
  OrderStatus,
} from "@/entities/order/model/types";
import type { IOrderRepository } from "@/entities/order";
import {
  PaymentMethodEnum,
  OrderStatusEnum,
} from "@/entities/order/model/enums";
import { cache } from "react";
import { BaseRepository } from "./base.repository";

// Типи для сирих даних з БД (snake_case)
type RawOrderItem = {
  product_id: string;
  quantity: number;
  price: number;
};

type RawOrder = {
  id: string;
  created_at: string;
  order_items: RawOrderItem[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  payment_method: string;
  shipping_address: string;
  order_note?: string;
  status: string;
};

class SupabaseOrderRepository
  extends BaseRepository<Order, RawOrder>
  implements IOrderRepository
{
  protected tableName = "orders";

  protected toCamelCase = (rawOrder: RawOrder): Order => {
    const {
      created_at,
      order_items,
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
      payment_method,
      shipping_address,
      order_note,
      status,
      ...rest
    } = rawOrder;

    const items: OrderItem[] = order_items.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const validatedPaymentMethod = PaymentMethodEnum.parse(
      payment_method,
    ) as PaymentMethod;
    const validatedStatus = OrderStatusEnum.parse(status) as OrderStatus;

    return {
      ...rest,
      items,
      createdAt: created_at,
      customerName: customer_name,
      customerEmail: customer_email,
      customerPhone: customer_phone,
      totalAmount: total_amount,
      paymentMethod: validatedPaymentMethod,
      shippingAddress: shipping_address,
      orderNote: order_note,
      status: validatedStatus,
    };
  };

  async create(data: CreateOrderPayload): Promise<Order> {
    const { items, ...orderData } = data;

    const rpcPayload = {
      order_data: {
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        shipping_address: orderData.shippingAddress,
        order_note: orderData.orderNote,
      },
      order_items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const { data: newOrder, error } = await this.supabase
      .rpc("create_order_with_items", rpcPayload)
      .select("*, order_items(*)")
      .single();

    if (error) {
      this.handleError(error, "Не вдалося створити замовлення.");
    }

    // `as unknown as RawOrder` потрібен, оскільки TypeScript не знає тип,
    // що повертається з RPC-виклику.
    return this.toCamelCase(newOrder as unknown as RawOrder);
  }

  async getById(id: string): Promise<Order> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();

    if (error) {
      this.handleError(error);
    }

    return this.toCamelCase(data as unknown as RawOrder);
  }
}

// Створюємо і експортуємо кешований getter за тією ж схемою
const createRepo = async () => {
  const supabase = await createClient();
  return new SupabaseOrderRepository(supabase);
};

export const getOrderRepository = cache(createRepo);
