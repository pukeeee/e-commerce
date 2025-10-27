"use client";

import { useCartItem } from "@/entities/cart/model/selectors";
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
  const { quantity, addItem, increaseQuantity, decreaseQuantity } = useCartItem(
    product.id,
  );

  // Якщо товару немає в кошику, показуємо кнопку для додавання
  if (quantity === 0) {
    return (
      <Button
        onClick={() => addItem(product)}
        className="w-full"
        aria-label="Додати товар у кошик"
      >
        {/* Іконка, яка має відступ справа тільки на екранах sm і більше */}
        <ShoppingCartIcon className="h-4 w-4 sm:mr-2" />
        {/* Текст, який прихований по дефолту і з'являється на екранах sm і більше */}
        <span className="hidden sm:inline">Додати в кошик</span>
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
