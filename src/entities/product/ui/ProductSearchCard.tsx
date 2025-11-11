import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "../model/types";
import { formatPrice } from "@/shared/lib/utils";

interface ProductSearchCardProps {
  product: PublicProduct;
  onClose: () => void;
}

/**
 * @entity ProductSearchCard
 * @description Компактна картка товару для відображення в результатах пошуку.
 * @param product Дані про товар.
 * @param onClose Функція, що викликається при кліку для закриття батьківського компонента.
 */
export function ProductSearchCard({
  product,
  onClose,
}: ProductSearchCardProps) {
  const imageUrl = product.imageUrl || "/images/placeholder.svg";

  return (
    <Link
      href={`/products/${product.id}`}
      onClick={onClose}
      className="group flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-accent"
    >
      {/* Image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold leading-tight group-hover:text-accent-foreground">
          {product.name}
        </p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
