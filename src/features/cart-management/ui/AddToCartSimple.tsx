"use client";

import { memo } from "react";
import { ShoppingCart, ShoppingBag, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ButtonSkeleton } from "@/shared/ui/skeleton";
import { useCartItem } from "../lib/use-cart-item";
import type { AddToCartBaseProps } from "../types";
import { cn } from "@/shared/lib/utils";

interface AddToCartSimpleProps extends AddToCartBaseProps {
  /** Текст кнопки "Відкрити кошик" */
  cartButtonText?: string;
  /** Шлях до кошика */
  cartPath?: string;
  /**
   * Визначає поведінку кнопки, коли товар вже в кошику.
   * - 'link': (за замовчуванням) показує кнопку-посилання.
   * - 'disabled': показує неактивну кнопку.
   */
  inCartBehavior?: "link" | "disabled";
}

/**
 * @feature AddToCartSimple
 * @description
 * Проста кнопка "Додати в кошик", яка змінюється після додавання товару.
 *
 * @example
 * ```tsx
 * <AddToCartSimple product={product} /> // Поведінка 'link'
 * <AddToCartSimple product={product} inCartBehavior="disabled" /> // Поведінка 'disabled'
 * ```
 */
export const AddToCartSimple = memo<AddToCartSimpleProps>(
  ({
    product,
    className,
    disabled,
    size = "default",
    variant = "default",
    cartButtonText = "Відкрити кошик",
    cartPath = "/checkout",
    inCartBehavior = "link",
  }) => {
    const { isHydrated, isInCart, addToCart } = useCartItem(product.id);

    // Показуємо skeleton під час гідратації
    if (!isHydrated) {
      return <ButtonSkeleton className={className} />;
    }

    // Якщо товар у кошику, показуємо відповідну поведінку
    if (isInCart) {
      if (inCartBehavior === "disabled") {
        return (
          <Button
            disabled
            size={size}
            variant="secondary"
            className={cn("w-full", className)}
          >
            <Check className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Товар в кошику</span>
          </Button>
        );
      }

      return (
        <Button
          asChild
          size={size}
          variant={variant}
          className={cn("w-full", className)}
        >
          <Link href={cartPath}>
            <ShoppingBag className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{cartButtonText}</span>
          </Link>
        </Button>
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
  }
);

AddToCartSimple.displayName = "AddToCartSimple";
