// src/widgets/wishlist-sheet/ui/wishlist-item.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

import type { PublicProduct } from "@/entities/product";
import { formatPrice } from "@/shared/lib/utils";
import { AddToCartButton } from "@/features/add-to-cart";
import { ToggleFavoriteButton } from "@/features/toggle-favorite";

interface WishlistItemProps {
  product: PublicProduct;
}

export const WishlistItem = ({ product }: WishlistItemProps) => {
  return (
    <div className="flex items-start gap-4 py-4">
      <Link href={`/products/${product.id}`} className="block flex-shrink-0">
        <Image
          src={product.imageUrl ?? "/images/placeholder.svg"}
          alt={product.name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
      </Link>
      <div className="flex-grow">
        <Link
          href={`/products/${product.id}`}
          className="block text-sm font-medium hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-sm font-semibold">
          {formatPrice(product.price)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <AddToCartButton product={product} />
        </div>
      </div>
      <ToggleFavoriteButton productId={product.id} />
    </div>
  );
};
