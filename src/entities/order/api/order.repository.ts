import { DatabaseError, NotFoundError } from "@/shared/lib/errors/app-error";
import { createClient } from "@/shared/lib/supabase/server";
import type {
  CreateOrderPayload,
  Order,
  OrderItem,
  PaymentMethod,
  OrderStatus,
} from "@/entities/order/model/types";
import type { IOrderRepository } from "../model/interfaces";
import {
  PaymentMethodEnum,
  OrderStatusEnum,
} from "@/entities/order/model/enums";

// Типи для сирих даних з БД (snake_case)
type RawOrderItem = {
  product_id: string;
  quantity: number;
  price: number;
};

// Omit<> тепер включає всі поля, які ми будемо валідувати або перетворювати
type RawOrder = Omit<
  Order,
  | "createdAt"
  | "items"
  | "customerName"
  | "customerEmail"
  | "customerPhone"
  | "totalAmount"
  | "paymentMethod"
  | "shippingAddress"
  | "orderNote"
  | "status"
> & {
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

// Маппер для перетворення snake_case в camelCase
const toCamelCase = (rawOrder: RawOrder): Order => {
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

  // Валідація enum-полів за допомогою Zod
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

class SupabaseOrderRepository implements IOrderRepository {
  async create(data: CreateOrderPayload): Promise<Order> {
    const supabase = await createClient();
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

    const { data: newOrder, error } = await supabase
      .rpc("create_order_with_items", rpcPayload)
      .select("*, order_items(*)")
      .single();

    if (error) {
      throw new DatabaseError("Не вдалося створити замовлення.", {
        code: error.code,
        message: error.message,
      });
    }

    return toCamelCase(newOrder as unknown as RawOrder);
  }

  async getById(id: string): Promise<Order> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("Замовлення");
      }
      throw new DatabaseError("Помилка при отриманні замовлення.", {
        code: error.code,
        message: error.message,
      });
    }

    return toCamelCase(data as unknown as RawOrder);
  }
}

export const orderRepository = new SupabaseOrderRepository();
