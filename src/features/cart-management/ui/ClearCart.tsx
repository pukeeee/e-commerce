"use client";

import { memo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useCartActions } from "../lib/use-cart-item";
import type { ClearCartProps } from "../types";
import { cn } from "@/shared/lib/utils";

/**
 * @feature ClearCart
 * @description
 * Кнопка для очищення всього кошика.
 * Підтримує підтвердження дії через діалог.
 *
 * @example
 * ```tsx
 * <ClearCart />
 * <ClearCart confirmationRequired={true} />
 * <ClearCart variant="destructive" onClear={() => console.log('cleared')} />
 * ```
 */
export const ClearCart = memo<ClearCartProps>(
  ({
    className,
    variant = "outline",
    size = "default",
    onClear,
    confirmationRequired = true,
  }) => {
    const { clear, itemCount } = useCartActions();
    const [showDialog, setShowDialog] = useState(false);

    const handleClear = () => {
      clear();
      onClear?.();
      setShowDialog(false);
    };

    const handleClick = () => {
      if (confirmationRequired) {
        setShowDialog(true);
      } else {
        handleClear();
      }
    };

    // Не показуємо кнопку, якщо кошик порожній
    if (itemCount === 0) {
      return null;
    }

    return (
      <>
        <Button
          variant={variant}
          size={size}
          onClick={handleClick}
          className={cn("w-full", className)}
          aria-label="Очистити кошик"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Очистити кошик
        </Button>

        {confirmationRequired && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Очистити кошик?</DialogTitle>
                <DialogDescription>
                  Ви впевнені, що хочете видалити всі товари з кошика? Цю дію
                  неможливо скасувати.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Скасувати
                </Button>
                <Button variant="destructive" onClick={handleClear}>
                  Очистити
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
);

ClearCart.displayName = "ClearCart";
