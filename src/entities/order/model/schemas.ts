import { z } from "zod";
import { PaymentMethodEnum, OrderStatusEnum } from "./enums";
import { normalizePhoneNumber } from "@/shared/lib/formatters";

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
    .trim()
    .min(2, "Ім'я має містити принаймні 2 символи")
    .max(100, "Ім'я занадто довге")
    .regex(
      /^[а-яА-ЯіІїЇєЄґҐa-zA-Z'\s-]+$/,
      "Ім'я може містити тільки літери, апострофи та дефіси",
    ),

  customerEmail: z
    .email("Неправильний формат електронної пошти")
    .trim()
    .toLowerCase()
    .max(255, "Email занадто довгий"),

  customerPhone: z
    .string()
    .trim()
    .min(10, "Номер телефону занадто короткий")
    // Трансформуємо вхідне значення перед валідацією
    .transform(normalizePhoneNumber)
    // Після нормалізації перевіряємо, чи номер відповідає формату +380...
    .refine(
      (val) => val.startsWith("+380") && val.length === 13,
      "Неправильний формат українського номера (має бути +380...)",
    ),

  items: z
    .array(OrderItemSchema)
    .min(1, "Кошик не може бути порожнім")
    .max(50, "Максимальна кількість товарів - 50"),

  totalAmount: z
    .number()
    .positive("Загальна сума має бути позитивною")
    .max(10_000_000, "Сума замовлення занадто велика")
    .refine(
      (val) => val >= 1, // Мінімальна сума 1 грн
      "Мінімальна сума замовлення - 1 ₴",
    ),

  paymentMethod: PaymentMethodEnum,

  shippingAddress: z
    .string()
    .trim()
    .min(10, "Адреса доставки має містити принаймні 10 символів")
    .max(200, "Адреса доставки занадто довга"),
  // .refine(
  //   (val) => val.split(" ").length >= 3,
  //   "Вкажіть повну адресу (місто, вулиця, номер будинку)",
  // ),

  orderNote: z
    .string()
    .trim()
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
  createdAt: z.iso.datetime(), // Використовуємо актуальний метод
  status: OrderStatusEnum.default("pending"),
});
