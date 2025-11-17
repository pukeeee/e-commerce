// src/widgets/wishlist-sheet/ui/wishlist-button.tsx
"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useWishlist } from "@/entities/wishlist";
import { Badge } from "@/shared/ui/badge";

export const WishlistButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, "children">
>(({ className, ...props }, ref) => {
  const productIds = useWishlist((state) => state.productIds);
  const count = productIds.length;

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      aria-label="Відкрити обрані товари"
      className={`relative ${className ?? ""}`}
      {...props}
    >
      <Heart className="h-5 w-5" />
      <span className="sr-only">Відкрити обрані товари</span>
      {count > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs"
        >
          {count}
        </Badge>
      )}
    </Button>
  );
});

WishlistButton.displayName = "WishlistButton";
