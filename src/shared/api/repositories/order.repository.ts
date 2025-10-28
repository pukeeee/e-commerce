import { createClient } from "@/shared/api/supabase/server";
import type {
  CreateOrderPayload,
  Order,
  OrderItem,
  IOrderRepository,
} from "@/entities/order";
import {
  PaymentMethodEnum,
  OrderStatusEnum,
} from "@/entities/order/model/enums";
import { CACHE_TAGS, createCachedFunction } from "@/shared/lib/cache";
import { CACHE_TIMES } from "@/shared/config/constants";
import { handleSupabaseError } from "@/shared/lib/errors/supabase-error-handler";

// --- Типи та маппери ---

type RawOrderItem = { product_id: string; quantity: number; price: number };
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

const mapOrder = (rawOrder: RawOrder): Order => {
  const items: OrderItem[] = rawOrder.order_items.map((item) => ({
    productId: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  return {
    id: rawOrder.id,
    items,
    createdAt: rawOrder.created_at,
    customerName: rawOrder.customer_name,
    customerEmail: rawOrder.customer_email,
    customerPhone: rawOrder.customer_phone,
    totalAmount: rawOrder.total_amount,
    paymentMethod: PaymentMethodEnum.parse(rawOrder.payment_method),
    shippingAddress: rawOrder.shipping_address,
    orderNote: rawOrder.order_note,
    status: OrderStatusEnum.parse(rawOrder.status),
  };
};

// --- Функції репозиторію ---

async function create(data: CreateOrderPayload): Promise<Order> {
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
    handleSupabaseError(error, {
      tableName: "orders (rpc)",
      customMessage: "Не вдалося створити замовлення",
    });
  }
  return mapOrder(newOrder as unknown as RawOrder);
}

async function getByIdUncached(id: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    handleSupabaseError(error, { tableName: "orders" });
  }
  return mapOrder(data as unknown as RawOrder);
}

// --- Кешована версія getById ---

const getById = (id: string) =>
  createCachedFunction(() => getByIdUncached(id), [CACHE_TAGS.order(id)], {
    revalidate: CACHE_TIMES.ORDERS,
    tags: [CACHE_TAGS.orders, CACHE_TAGS.order(id)],
  })();

// --- Експортований репозиторій ---

export const orderRepository: IOrderRepository = {
  create,
  getById,
};
