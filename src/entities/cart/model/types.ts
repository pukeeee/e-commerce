import { z } from "zod";
import { CartItemSchema, CartSchema } from "./schemas";

/**
 * @description Тип одного товару в кошику.
 */
export type CartItem = z.infer<typeof CartItemSchema>;

/**
 * @description Тип кошика як сутності даних.
 */
export type Cart = z.infer<typeof CartSchema>;
