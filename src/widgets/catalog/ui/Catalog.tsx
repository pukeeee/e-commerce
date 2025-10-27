import { ProductCard } from "@/entities/product/ui/ProductCard";
import type { PublicProduct } from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";

interface ProductGridProps {
  products: PublicProduct[];
}

/**
 * @widget ProductGrid
 * @description Віджет для відображення списку товарів у вигляді сітки.
 * @param products Масив товарів для відображення.
 */
export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Товари не знайдено</h3>
          <p className="mt-2 text-muted-foreground">
            Спробуйте змінити фільтри або зайти пізніше.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          actionSlot={<AddToCartButton product={product} />}
        />
      ))}
    </div>
  );
}
