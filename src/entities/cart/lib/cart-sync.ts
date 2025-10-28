import type { CartItem } from "../model/types";
import type { PublicProduct } from "@/entities/product";

export interface SyncResult {
  syncedItems: Record<string, CartItem>;
  removedItems: CartItem[];
  updatedItems: CartItem[];
  hasChanges: boolean;
}

/**
 * Синхронізує кошик з актуальними даними про товари.
 * @param cartItems - Поточні товари в кошику.
 * @param actualProducts - Актуальні дані про товари з сервера.
 * @returns Результат синхронізації.
 */
export function syncCartWithProducts(
  cartItems: Record<string, CartItem>,
  actualProducts: PublicProduct[],
): SyncResult {
  const syncedItems: Record<string, CartItem> = {};
  const removedItems: CartItem[] = [];
  const updatedItems: CartItem[] = [];
  let hasChanges = false;

  const productsMap = new Map(actualProducts.map((p) => [p.id, p]));

  // 1. Проходимо по товарах, що зараз в кошику
  for (const productId in cartItems) {
    const cartItem = cartItems[productId];
    const actualProduct = productsMap.get(productId);

    // Якщо товару більше немає або він неактивний - в список на видалення
    if (!actualProduct) {
      removedItems.push(cartItem);
      hasChanges = true;
      continue;
    }

    // Створюємо оновлений товар, беручи всі дані з сервера, а кількість - з кошика
    const syncedItem: CartItem = {
      id: actualProduct.id,
      name: actualProduct.name,
      price: actualProduct.price,
      imageUrl: actualProduct.imageUrl,
      quantity: cartItem.quantity,
    };

    // Перевіряємо, чи були зміни в ціні, назві або зображенні
    const wasUpdated =
      cartItem.price !== syncedItem.price ||
      cartItem.name !== syncedItem.name ||
      cartItem.imageUrl !== syncedItem.imageUrl;

    if (wasUpdated) {
      updatedItems.push(syncedItem);
      hasChanges = true;
    }

    syncedItems[productId] = syncedItem;
  }

  // 2. Перевіряємо, чи не з'явилися в кошику товари, яких не було раніше
  // (це може статися, якщо localStorage був змінений вручну або в іншій вкладці)
  if (Object.keys(cartItems).length !== Object.keys(syncedItems).length) {
    hasChanges = true;
  }

  return { syncedItems, removedItems, updatedItems, hasChanges };
}
