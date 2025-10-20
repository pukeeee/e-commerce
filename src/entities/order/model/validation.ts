import { z } from "zod";

export const PaymentMethodEnum = {
  Stripe: "Stripe",
  CashOnDelivery: "Накладений платіж",
} as const;

export const OrderStatusEnum = {
  pending: "В очікуванні",
  paid: "Оплачено",
  shipped: "Відправлено",
  delivered: "Доставлено",
  cancelled: "Скасовано",
} as const;

export const OrderItemSchema = z.object({
  productId: z.uuid("Неправильний ID товару"),
  quantity: z.number().int().positive("Кількість має бути позитивним числом"),
  price: z.number().positive("Ціна має бути позитивним числом"),
});

export const OrderFormSchema = z.object({
  customerName: z.string().min(2, "Ім'я має містити принаймні 2 символи"),
  customerEmail: z.email("Неправильний формат електронної пошти"),
  customerPhone: z
    .string()
    .regex(
      /^\+?3?8?(0\d{9})$/,
      "Неправильний формат номера телефону (приклад: 0991234567)",
    ),
  items: z.array(OrderItemSchema).min(1, "Кошик не може бути порожнім"),
  totalAmount: z.number().positive("Загальна сума має бути позитивною"),
  paymentMethod: z.enum(Object.keys(PaymentMethodEnum)),
  shippingAdress: z
    .string()
    .min(10, "Адреса доставки має містити принаймні 10 символів")
    .max(40, "Адреса доставки має містити до 40 символів"),
  orderNote: z
    .string()
    .min(5, "Коментар до має містити принаймні 5 символів")
    .max(30, "Коментар до має містити до 30 символів")
    .optional(),
});

export const OrderSchema = OrderFormSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  status: z.enum(Object.keys(OrderStatusEnum)).default("pending"),
});
