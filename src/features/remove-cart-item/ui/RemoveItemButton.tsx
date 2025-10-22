"use client";

import { Trash2Icon } from "lucide-react";
import { useCart } from "@/entities/cart";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface RemoveItemButtonProps {
  itemId: string;
  className?: string;
}

/**
 * @description Feature-компонент для видалення товару з кошика.
 * @param {RemoveItemButtonProps} props
 */
export const RemoveItemButton = ({
  itemId,
  className,
}: RemoveItemButtonProps) => {
  const remove = useCart((s) => s.removeItem);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 text-muted-foreground hover:text-destructive",
        className,
      )}
      onClick={() => remove(itemId)}
      aria-label="Видалити товар"
    >
      <Trash2Icon className="h-5 w-5" />
    </Button>
  );
};
