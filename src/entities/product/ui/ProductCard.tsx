import Image from "next/image";
import type { PublicProduct } from "../model/types";
import { formatPrice } from "@/shared/lib/utils";
import Link from "next/link";

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
export function ProductCard({
  product,
  actionSlot,
  priority,
}: ProductCardProps) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm
   transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              // Використовуємо placeholder для покращення UX
              // placeholder="blur"
              // blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105 bg-muted"
              // Якість для основних зображень
              quality={75}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
              <span className="text-sm">Немає фото</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/products/${product.id}`}
          className="flex-1 hover:text-primary transition-colors"
        >
          <h3 className="font-semibold leading-tight tracking-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-lg font-bold">{formatPrice(product.price)}</p>
        {actionSlot && <div className="mt-4">{actionSlot}</div>}
      </div>
    </div>
  );
}
