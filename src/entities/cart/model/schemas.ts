import { z } from "zod";
import { PublicProductSchema } from "@/entities/product/";

/**
 * @description Схема одного товару в кошику.
 * Розширює публічну схему товару, додаючи поле quantity.
 */
export const CartItemSchema = PublicProductSchema.pick({
  id: true,
  name: true,
  price: true,
  imageUrl: true,
}).extend({
  quantity: z
    .number()
    .int()
    .positive("Кількість має бути позитивним числом")
    .max(50, "Максимальна кількість одного товару - 50"),
});

/**
 * @description Схема кошика, що містить масив товарів.
 * Це основна модель даних для кошика.
 */
export const CartSchema = z.object({
  items: z.array(CartItemSchema),
});
