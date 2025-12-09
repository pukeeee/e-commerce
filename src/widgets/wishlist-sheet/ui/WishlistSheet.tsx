"use client";

import { useEffect, useState, useTransition, memo, type ComponentProps } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
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
import { useWishlist, useClearWishlist } from "@/entities/wishlist";
import { getProductsByIdsAction } from "@/features/get-products-by-ids/action";
import type { PublicProduct } from "@/entities/product";
import { WishlistItem } from "./WishlistItem";
import { WishlistItemSkeleton } from "./WishlistItemSkeleton";
import { useCartItems } from "@/entities/cart";
import { cn } from "@/shared/lib/utils";

const WishlistBadge = memo(() => {
  const productIds = useWishlist((state) => state.productIds);
  const isHydrated = useWishlist((state) => state.isHydrated);
  const count = productIds.length;

  if (!isHydrated || count === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs"
    >
      {count}
    </Badge>
  );
});
WishlistBadge.displayName = "WishlistBadge";

interface WishlistSheetProps {
  triggerProps?: Partial<ComponentProps<typeof Button>>;
}

export function WishlistSheet({ triggerProps }: WishlistSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const productIds = useWishlist((state) => state.productIds);
  const clearWishlist = useClearWishlist();
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [isPending, startTransition] = useTransition();

  const cartItems = useCartItems();
  const isAnyInCart = products.some((p) => cartItems[p.id]);

  useEffect(() => {
    if (isOpen && productIds.length > 0) {
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
    } else if (productIds.length === 0) {
      setProducts([]);
    }
  }, [productIds, isOpen]);

  const handleClearAll = () => {
    clearWishlist();
  };

  const handleCheckoutClick = () => {
    setIsOpen(false);
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
          <p className="text-muted-foreground px-12">
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
        <SheetFooter className="grid gap-2 px-6 py-4">
          {isAnyInCart && (
            <Button asChild className="w-full">
              <Link href="/checkout" onClick={handleCheckoutClick}>
                Оформити замовлення
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={handleClearAll} className="w-full">
            Очистити все
          </Button>
        </SheetFooter>
      </>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          {...triggerProps}
          className={cn("relative", triggerProps?.className)}
        >
          <Heart className="h-6 w-6" />
          <span className="sr-only">Відкрити обране</span>
          <WishlistBadge />
        </Button>
      </SheetTrigger>
      <SheetContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex w-full flex-col sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle>Обрані товари</SheetTitle>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
