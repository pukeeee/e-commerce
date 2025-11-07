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
import { CACHE_TAGS } from "@/shared/lib/cache";
import { CACHE_TIMES } from "@/shared/config/constants";
import { handleSupabaseError } from "@/shared/lib/errors/supabase-error-handler";
import { createClient } from "@/shared/api/supabase/server";
import { unstable_cache } from "next/cache";

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
  // Створюємо плаский payload, який очікує SQL-функція
  const rpcPayload = {
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    customer_phone: data.customerPhone,
    total_amount: data.totalAmount,
    payment_method: data.paymentMethod,
    shipping_address: data.shippingAddress,
    order_note: data.orderNote,
    // SQL-функція очікує `items` з `productId` в camelCase
    items: data.items,
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

async function getById(id: string): Promise<Order | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Замовлення - це дані конкретного користувача.
  // RLS в Supabase має гарантувати, що користувач бачить лише свої замовлення.
  // Додавання user.id в ключ кешу гарантує, що кеш одного користувача не буде показаний іншому.
  const userId = session?.user.id;
  if (!userId) {
    return null; // Анонімні користувачі не мають замовлень
  }

  const getByIdCached = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single(); // Припускаємо, що RLS налаштована і фільтрує по user_id

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        handleSupabaseError(error, { tableName: "orders" });
      }
      return data ? mapOrder(data as unknown as RawOrder) : null;
    },
    [CACHE_TAGS.order(id), userId], // Унікальний ключ для замовлення + користувача
    {
      revalidate: CACHE_TIMES.ORDERS,
      tags: [CACHE_TAGS.order(id)],
    },
  );

  return getByIdCached();
}

// --- Експортований репозиторій ---

export const orderRepository: IOrderRepository = {
  create,
  getById,
};
