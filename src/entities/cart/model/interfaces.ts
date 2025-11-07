import { CartItem } from "./types";
import { PublicProduct } from "@/entities/product";

// Інформація про зміни, яку поверне синхронізація для UI
export interface SyncChanges {
  removedItems: CartItem[];
  updatedItems: CartItem[];
}

/**
 * @description Інтерфейс для клієнтського state-менеджера кошика (наприклад, Zustand).
 * Він описує стан (state) та дії (actions) для маніпуляції кошиком на клієнті.
 */
export interface CartStoreState {
  // --- state ---
  items: Record<string, CartItem>;
  isHydrated: boolean;

  // --- actions ---
  _hasHydrated: () => void;
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  syncWithServer: (actualProducts: PublicProduct[]) => Promise<SyncChanges>;
}
