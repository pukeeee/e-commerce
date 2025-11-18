"use client";

import { memo } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ButtonSkeleton } from "@/shared/ui/skeleton";
import { useCartItem } from "../lib/use-cart-item";
import { CartItemQuantity } from "./CartItemQuantity";
import type { AddToCartBaseProps } from "../types";
import { cn } from "@/shared/lib/utils";

/**
 * @feature AddToCartButton
 * @description
 * Кнопка "Додати в кошик", яка автоматично перетворюється на каунтер
 * після додавання товару. Ідеальна для карток товарів та деталей.
 *
 * @example
 * ```tsx
 * <AddToCartButton product={product} />
 * <AddToCartButton product={product} size="lg" variant="secondary" />
 * ```
 */
export const AddToCartButton = memo<AddToCartBaseProps>(
  ({ product, className, disabled, size = "default", variant = "default" }) => {
    const { isHydrated, isInCart, addToCart } = useCartItem(product.id);

    // Показуємо skeleton під час гідратації
    if (!isHydrated) {
      return <ButtonSkeleton className={className} />;
    }

    // Якщо товар у кошику, показуємо каунтер
    if (isInCart) {
      return (
        <CartItemQuantity
          productId={product.id}
          className={className}
          size={size === "icon" ? "default" : size}
        />
      );
    }

    // Інакше показуємо кнопку додавання
    return (
      <Button
        onClick={() => addToCart(product)}
        disabled={disabled}
        size={size}
        variant={variant}
        className={cn("w-full", className)}
        aria-label={`Додати ${product.name} у кошик`}
      >
        <ShoppingCart className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Додати в кошик</span>
      </Button>
    );
  },
);

AddToCartButton.displayName = "AddToCartButton";
