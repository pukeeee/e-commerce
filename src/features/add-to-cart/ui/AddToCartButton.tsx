"use client";

import { useCart } from "@/entities/cart";
import type { PublicProduct } from "@/entities/product";
import { Button } from "@/shared/ui/button";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { ClientOnly } from "@/shared/lib/hydration/ClientOnly";
import { ButtonSkeleton } from "@/shared/ui/skeleton";
import { memo } from "react";

interface AddToCartButtonProps {
  product: PublicProduct;
}

/**
 * Компонент кнопки для додавання/оновлення товару в кошику.
 * Показує або кнопку "Додати в кошик", або лічильник для зміни кількості.
 */
const AddToCartButtonInner = ({ product }: AddToCartButtonProps) => {
  // Отримуємо кількість товару (це єдина підписка, що викликає ре-рендер)
  const quantity = useCart((state) => state.items[product.id]?.quantity ?? 0);

  // Отримуємо екшени. Zustand гарантує, що вони стабільні і їх виклик не призведе до ре-рендеру.
  const addItem = useCart((state) => state.addItem);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);

  // Якщо товару немає в кошику, показуємо кнопку для додавання
  if (quantity === 0) {
    return (
      <Button
        onClick={() => addItem(product)}
        className="w-full"
        aria-label="Додати товар у кошик"
      >
        <ShoppingCartIcon className="mr-2 h-4 w-4" />
        Додати в кошик
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => decreaseQuantity(product.id)}
        aria-label="Зменшити кількість товару"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <span className="min-w-[2rem] text-center font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => increaseQuantity(product.id)}
        aria-label="Збільшити кількість товару"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const AddToCartButton = memo(({ product }: AddToCartButtonProps) => {
  return (
    <ClientOnly fallback={<ButtonSkeleton />}>
      <AddToCartButtonInner product={product} />
    </ClientOnly>
  );
});

AddToCartButton.displayName = "AddToCartButton";
