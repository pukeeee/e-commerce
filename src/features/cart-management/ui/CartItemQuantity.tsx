"use client";

import { memo } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCartItem } from "../lib/use-cart-item";
import type { QuantityControlProps } from "../types";
import { cn } from "@/shared/lib/utils";

/**
 * @feature CartItemQuantity
 * @description
 * Універсальний каунтер для управління кількістю товару в кошику.
 * Дозволяє видалити товар, натиснувши "мінус" при мінімальній кількості.
 *
 * @example
 * ```tsx
 * <CartItemQuantity productId={product.id} />
 * <CartItemQuantity productId={product.id} size="sm" />
 * <CartItemQuantity productId={product.id} showValue={false} />
 * ```
 */
export const CartItemQuantity = memo<QuantityControlProps>(
  ({
    productId,
    className,
    size = "default",
    showValue = true,
    min = 1,
    max = 50,
  }) => {
    const { quantity, increase, decrease, remove } = useCartItem(productId);

    const sizeClasses = {
      sm: "h-7 w-7",
      default: "h-9 w-9",
      lg: "h-10 w-10",
    };

    const iconSizes = {
      sm: "h-3 w-3",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    };

    const isMinimum = quantity === min;
    const canDecrease = quantity >= min;
    const canIncrease = quantity < max;

    const handleDecrease = () => {
      if (isMinimum) {
        remove();
      } else {
        decrease();
      }
    };

    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleDecrease}
          disabled={!canDecrease}
          className={sizeClasses[size]}
          aria-label="Зменшити кількість"
        >
          <Minus className={iconSizes[size]} />
        </Button>

        {showValue && (
          <span
            className="min-w-[2rem] text-center font-medium tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {quantity}
          </span>
        )}

        <Button
          variant="secondary"
          size="icon"
          onClick={increase}
          disabled={!canIncrease}
          className={sizeClasses[size]}
          aria-label="Збільшити кількість"
        >
          <Plus className={iconSizes[size]} />
        </Button>
      </div>
    );
  },
);

CartItemQuantity.displayName = "CartItemQuantity";
