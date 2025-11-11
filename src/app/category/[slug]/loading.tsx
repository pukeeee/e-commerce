import { Skeleton } from "@/shared/ui/skeleton";

/**
 * @page CategoryLoading
 * @description Скелетон для сторінки категорії, що відображається під час завантаження даних.
 * Використовує Suspense API з Next.js для миттєвого рендеру.
 */
export default function CategoryLoading() {
  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Скелетон для хлібних крихт */}
        <div className="mb-4">
          <Skeleton className="h-5 w-1/4" />
        </div>

        {/* Скелетон для заголовка */}
        <div className="mb-8">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="mt-2 h-5 w-3/4" />
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Скелетон для панелі фільтрів */}
          <aside className="hidden lg:block">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-2/3 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-1/2 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>
          </aside>

          {/* Скелетон для сітки товарів */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card p-4 space-y-4"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
