"use client";

import { memo } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCartItem } from "../lib/use-cart-item";
import type { RemoveFromCartProps } from "../types";
import { cn } from "@/shared/lib/utils";

/**
 * @feature RemoveFromCart
 * @description
 * Кнопка для видалення товару з кошика.
 * Підтримує різні варіанти відображення.
 *
 * @example
 * ```tsx
 * <RemoveFromCart productId={product.id} />
 * <RemoveFromCart productId={product.id} variant="text" />
 * <RemoveFromCart productId={product.id} onRemove={() => console.log('removed')} />
 * ```
 */
export const RemoveFromCart = memo<RemoveFromCartProps>(
  ({
    productId,
    className,
    variant = "icon",
    size = "icon",
    onRemove,
  }) => {
    const { remove, item } = useCartItem(productId);

    const handleRemove = () => {
      remove();
      onRemove?.();
    };

    if (variant === "text") {
      return (
        <Button
          variant="ghost"
          size={size === "icon" ? "sm" : size}
          onClick={handleRemove}
          className={cn("text-destructive hover:text-destructive", className)}
          aria-label={`Видалити ${item?.name || "товар"} з кошика`}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Видалити
        </Button>
      );
    }

    const Icon = variant === "ghost" ? X : Trash2;

    return (
      <Button
        variant="ghost"
        size={size}
        onClick={handleRemove}
        className={cn(
          "text-muted-foreground hover:text-destructive",
          size === "icon" && "h-8 w-8",
          className
        )}
        aria-label={`Видалити ${item?.name || "товар"} з кошика`}
      >
        <Icon className="h-5 w-5" />
      </Button>
    );
  }
);

RemoveFromCart.displayName = "RemoveFromCart";
