import Image from "next/image";
import type { PublicProduct } from "../model/types";
import { formatPrice } from "@/shared/lib/utils";

interface ProductCardProps {
  product: PublicProduct;
  actionSlot?: React.ReactNode;
  priority?: boolean;
}

/**
 * @entity ProductCard
 * @description Картка товару для відображення в каталозі або списках.
 * @param product Дані про товар.
 * @param actionSlot Слот для кнопки дії (наприклад, "Додати в кошик").
 */
export function ProductCard({ product, actionSlot, priority }: ProductCardProps) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm
   transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
            <span className="text-sm">Немає фото</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="flex-1 font-semibold leading-tight tracking-tight">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold">{formatPrice(product.price)}</p>
        {actionSlot && <div className="mt-4">{actionSlot}</div>}
      </div>
    </div>
  );
}
