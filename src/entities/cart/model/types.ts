import { z } from "zod";
import { PublicProductSchema } from "@/entities/product/model/types";

// =================================================================
// ZOD SCHEMAS
// =================================================================

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

// =================================================================
// TYPES
// =================================================================

/**
 * @description Тип одного товару в кошику.
 */
export type CartItem = z.infer<typeof CartItemSchema>;

/**
 * @description Тип кошика як сутності даних.
 */
export type Cart = z.infer<typeof CartSchema>;

// =================================================================
// STORE INTERFACE
// =================================================================

/**
 * @description Інтерфейс для клієнтського state-менеджера кошика (наприклад, Zustand).
 * Він описує стан (state) та дії (actions) для маніпуляції кошиком на клієнті.
 */
export interface CartStoreState {
  // --- state ---
  items: Record<string, CartItem>;
  // --- actions ---
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
}
