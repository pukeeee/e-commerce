"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { useWishlist, useClearWishlist } from "@/entities/wishlist";
import { getProductsByIdsAction } from "@/features/get-products-by-ids/action";
import type { PublicProduct } from "@/entities/product";
import { WishlistItem } from "./WishlistItem";
import { WishlistItemSkeleton } from "./WishlistItemSkeleton";

interface WishlistSheetProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function WishlistSheet({
  trigger,
  isOpen,
  onOpenChange,
}: WishlistSheetProps) {
  const productIds = useWishlist((state) => state.productIds);
  const clearWishlist = useClearWishlist();
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (productIds.length > 0) {
      startTransition(async () => {
        const res = await getProductsByIdsAction(productIds);
        if (res.success) {
          const productsMap = new Map(res.data.map((p) => [p.id, p]));
          const sortedProducts = productIds
            .map((id) => productsMap.get(id))
            .filter((p): p is PublicProduct => p !== undefined);
          setProducts(sortedProducts);
        } else {
          console.error(res.error);
          setProducts([]);
        }
      });
    } else {
      setProducts([]);
    }
  }, [productIds]);

  const handleClearAll = () => {
    clearWishlist();
  };

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex-1 divide-y overflow-y-auto px-6">
          <WishlistItemSkeleton />
          <WishlistItemSkeleton />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <h3 className="text-xl font-semibold">Ваш список бажань порожній</h3>
          <p className="text-muted-foreground">
            Додайте товари, які вам сподобалися, щоб не втратити їх.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="flex-1 overflow-y-auto px-6">
          <div className="divide-y divide-border">
            {products.map((product) => (
              <WishlistItem key={product.id} product={product} />
            ))}
          </div>
        </div>
        <SheetFooter className="px-6 py-4">
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="w-full"
          >
            Очистити все
          </Button>
        </SheetFooter>
      </>
    );
  };

  const sheetContent = (
    <SheetContent className="flex w-full flex-col sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Обрані товари</SheetTitle>
      </SheetHeader>
      {renderContent()}
    </SheetContent>
  );

  if (trigger) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        {sheetContent}
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Wishlist</Button>
      </SheetTrigger>
      {sheetContent}
    </Sheet>
  );
}
