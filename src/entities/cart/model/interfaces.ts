import { CartItem } from "./types";

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
