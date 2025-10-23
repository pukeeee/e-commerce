import z from "zod";
import { PaymentMethodEnum, OrderStatusEnum } from "./enums";

/**
 * Схема для одного товару в кошику/замовленні.
 */
export const OrderItemSchema = z.object({
  productId: z.uuid("Неправильний ID товару"),
  quantity: z
    .number()
    .int()
    .positive("Кількість має бути позитивним числом")
    .max(999, "Максимальна кількість - 999"),
  price: z
    .number()
    .positive("Ціна має бути позитивним числом")
    .max(1_000_000, "Ціна занадто велика"),
});

/**
 * Схема для даних, необхідних для створення нового замовлення (корисне навантаження).
 * Використовується у формах та при передачі даних в API.
 */
export const CreateOrderPayloadSchema = z.object({
  customerName: z
    .string()
    .min(2, "Ім'я має містити принаймні 2 символи")
    .max(100, "Ім'я занадто довге"),
  customerEmail: z
    .email("Неправильний формат електронної пошти")
    .toLowerCase()
    .trim(),
  customerPhone: z
    .string()
    .trim()
    .regex(
      /^\+?3?8?(0\d{9})$/,
      "Неправильний формат номера телефону (приклад: 0991234567 або +380991234567)",
    )
    .transform((val) => {
      // Нормалізуємо номер телефону
      const digits = val.replace(/\D/g, "");
      if (digits.startsWith("380")) {
        return `+${digits}`;
      }
      if (digits.startsWith("0")) {
        return `+38${digits}`;
      }
      return `+380${digits}`;
    }),
  items: z
    .array(OrderItemSchema)
    .min(1, "Кошик не може бути порожнім")
    .max(50, "Максимальна кількість товарів - 50"),
  totalAmount: z
    .number()
    .positive("Загальна сума має бути позитивною")
    .max(10_000_000, "Сума замовлення занадто велика"),
  paymentMethod: PaymentMethodEnum,
  shippingAdress: z
    .string()
    .min(10, "Адреса доставки має містити принаймні 10 символів")
    .max(200, "Адреса доставки занадто довга"),
  orderNote: z
    .string()
    .max(500, "Коментар занадто довгий")
    .optional()
    .or(z.literal("")),
});

/**
 * Повна схема замовлення, що включає поля, які генеруються сервером (id, createdAt, status).
 * Являє собою модель замовлення в базі даних.
 */
export const OrderSchema = CreateOrderPayloadSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  status: OrderStatusEnum.default("pending"),
});
