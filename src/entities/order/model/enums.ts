import { z } from "zod";

export const PaymentMethodEnum = z.enum(["stripe", "cash_on_delivery"]);
export const PaymentMethodLabels: Record<
  z.infer<typeof PaymentMethodEnum>,
  string
> = {
  stripe: "Stripe",
  cash_on_delivery: "Готівкою при отриманні",
};

export const OrderStatusEnum = z.enum([
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
]);
export const OrderStatusLabels: Record<
  z.infer<typeof OrderStatusEnum>,
  string
> = {
  pending: "В очікуванні",
  paid: "Оплачено",
  shipped: "Відправлено",
  delivered: "Доставлено",
  cancelled: "Скасовано",
};
