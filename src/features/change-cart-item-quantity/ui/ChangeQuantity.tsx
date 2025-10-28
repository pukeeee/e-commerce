"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useCart } from "@/entities/cart";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface ChangeQuantityProps {
  itemId: string;
  className?: string;
}

/**
 * @description Feature-компонент для зміни кількості товару в кошику.
 * @param {ChangeQuantityProps} props
 */
export const ChangeQuantity = ({ itemId, className }: ChangeQuantityProps) => {
  const increase = useCart((s) => s.increaseQuantity);
  const decrease = useCart((s) => s.decreaseQuantity);
  const quantity = useCart((s) => s.items[itemId]?.quantity ?? 1);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8"
        onClick={() => decrease(itemId)}
        aria-label="Зменшити кількість"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <span
        className="w-8 text-center font-medium"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8"
        onClick={() => increase(itemId)}
        aria-label="Збільшити кількість"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
