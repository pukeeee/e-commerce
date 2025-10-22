"use client";

import { useCart } from "@/entities/cart";
import { CartItemCard } from "@/entities/cart/ui/CartItemCard";
import { ChangeQuantity } from "@/features/change-cart-item-quantity";
import { RemoveItemButton } from "@/features/remove-cart-item";

/**
 * @description
 * Віджет для відображення списку товарів у кошику.
 * Збирає картку товару (entity) та елементи керування (features) разом.
 */
export const CartItemsList = () => {
  // 1. Вибираємо зі стору об'єкт `items`.
  const itemsMap = useCart((state) => state.items);

  // 2. Перетворюємо об'єкт на масив вже в компоненті.
  const items = Object.values(itemsMap);

  // 3. Обробляємо випадок, коли кошик порожній.
  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-xl font-semibold">Ваш кошик порожній</h3>
        <p className="text-muted-foreground">
          Схоже, ви ще не додали жодного товару.
        </p>
      </div>
    );
  }

  // 4. Рендеримо список товарів.
  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          // 4. Передаємо feature-компоненти у відповідні слоти.
          quantityControl={<ChangeQuantity itemId={item.id} className="mt-2" />}
          removeControl={<RemoveItemButton itemId={item.id} />}
        />
      ))}
    </div>
  );
};
