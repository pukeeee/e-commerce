"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useCart, useCartStoreBase } from "@/entities/cart";
import { CartItemsList } from "./CartItemsList";
import { CartSummary } from "./CartSummary";
import { ClientOnly } from "@/shared/lib/hydration/ClientOnly";
import { toast } from "sonner";
import {
  useMemo,
  memo,
  useState,
  useEffect,
  useTransition,
  useCallback,
} from "react";
import { getProductsByIdsAction } from "@/features/get-products-by-ids/action";
import { CartItemSkeleton } from "@/shared/ui/skeleton";

const CartBadge = memo(() => {
  const items = useCart((state) => state.items);
  const count = useMemo(() => Object.keys(items).length, [items]);

  if (count === 0) return null;

  return (
    <Badge
      variant="destructive"
      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs"
    >
      {count}
    </Badge>
  );
});
CartBadge.displayName = "CartBadge";

/**
 * @description
 * Головний віджет кошика, реалізований як висувна панель (Sheet).
 * Поєднує в собі тригер (кнопку), список товарів та підсумок.
 */
export const CartSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const syncWithServer = useCart((state) => state.syncWithServer);
  const [isSyncing, startSyncTransition] = useTransition();

  // Виносимо логіку синхронізації в окрему функцію
  const handleSyncCart = useCallback(async () => {
    const currentItems = useCartStoreBase.getState().items;
    if (Object.keys(currentItems).length === 0) return;

    try {
      const productIds = Object.keys(currentItems);
      const result = await getProductsByIdsAction(productIds);

      if (!result.success) {
        toast.error(result.error.message || "Не вдалося оновити кошик.");
        return;
      }

      const { removedItems, updatedItems } = await syncWithServer(result.data);

      if (removedItems.length > 0) {
        toast.warning(
          `Видалено з кошика: ${removedItems.map((i) => i.name).join(", ")}`,
        );
      }
      if (updatedItems.length > 0) {
        toast.info(
          `Оновлено дані для: ${updatedItems.map((i) => i.name).join(", ")}`,
        );
      }
    } catch (error) {
      console.error("Помилка синхронізації кошика:", error);
      toast.error("Не вдалося оновити кошик.");
    }
  }, [syncWithServer]);

  useEffect(() => {
    if (isOpen) {
      startSyncTransition(() => {
        handleSyncCart();
      });
    }
  }, [isOpen, handleSyncCart]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Відкрити кошик</span>
          <ClientOnly>
            <CartBadge />
          </ClientOnly>
        </Button>
      </SheetTrigger>

      <SheetContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex w-full flex-col sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>Ваш кошик</SheetTitle>
        </SheetHeader>

        {isSyncing ? (
          <div className="my-4 flex-1 divide-y overflow-y-auto px-6">
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
          </div>
        ) : (
          <>
            <div className="my-4 flex-1 overflow-y-auto px-6">
              <CartItemsList />
            </div>
            <SheetFooter className="px-6 py-4">
              <CartSummary />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
