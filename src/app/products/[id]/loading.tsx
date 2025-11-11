import { Skeleton } from "@/shared/ui/skeleton";

/**
 * @page ProductLoading
 * @description Скелетон для сторінки товару, що відображається під час завантаження даних.
 */
export default function ProductLoading() {
  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Скелетон для хлібних крихт */}
        <div className="mb-6">
          <Skeleton className="h-5 w-1/3" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Скелетон зображення */}
          <div>
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>

          {/* Скелетон інформації про товар */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    </main>
  );
}
