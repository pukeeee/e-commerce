import { cn } from "@/shared/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Базовый компонент skeleton с анимацией
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-border", className)}
      {...props}
    />
  );
}

/**
 * Skeleton для кнопки
 */
export function ButtonSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-full", className)} />;
}

/**
 * Skeleton для карточки товара
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* Изображение */}
      <Skeleton className="aspect-square w-full" />

      <div className="space-y-3 p-4">
        {/* Название */}
        <Skeleton className="h-5 w-3/4" />

        {/* Описание */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Цена */}
        <Skeleton className="h-6 w-1/3" />

        {/* Кнопка */}
        <ButtonSkeleton />
      </div>
    </div>
  );
}

/**
 * Skeleton для списка товаров
 */
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton для элемента корзины
 */
export function CartItemSkeleton() {
  return (
    <div className="flex items-start gap-4 py-4">
      {/* Изображение */}
      <Skeleton className="h-24 w-24 flex-shrink-0 rounded-md" />

      <div className="flex flex-1 flex-col gap-2">
        {/* Название */}
        <Skeleton className="h-5 w-3/4" />
        {/* Цена */}
        <Skeleton className="h-4 w-1/4" />
        {/* Кнопки */}
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="flex flex-col items-end gap-2">
        {/* Кнопка удаления */}
        <Skeleton className="h-8 w-8 rounded-md" />
        {/* Итоговая цена */}
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}
