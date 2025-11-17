import { Skeleton } from "@/shared/ui/skeleton";

/**
 * @internal
 * @description
 * Компонент-скелетон для панелі фільтрів.
 * Його структура імітує реальний компонент `FilterPanel` для візуальної узгодженості під час завантаження.
 */
function FilterPanelSkeleton() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-4">
        {/* Скелетон для секції сортування */}
        <div>
          <Skeleton className="h-5 w-20 mb-2" /> {/* Label "Сортування" */}
          <Skeleton className="h-10 w-full" />   {/* Select Trigger */}
        </div>

        {/* Скелетон для секції фільтрації за ціною */}
        <div>
          <Skeleton className="h-5 w-12 mb-2" /> {/* Label "Ціна" */}
          <div className="flex gap-2 items-center">
            <Skeleton className="h-10 w-full" /> {/* Input "Від" */}
            <span className="text-muted-foreground">-</span>
            <Skeleton className="h-10 w-full" /> {/* Input "До" */}
          </div>
        </div>
      </div>

      {/* Скелетон для кнопки "Скинути фільтри" */}
      <div className="mt-auto">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

/**
 * @page CategoryLoading
 * @description
 * Скелетон для сторінки категорії, що відображається, поки дані завантажуються.
 * Використовується Next.js App Router's `loading.tsx` конвенцією.
 * Структура повністю відповідає фінальній верстці сторінки для плавного переходу.
 */
export default function CategoryLoading() {
  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Скелетон для хлібних крихт */}
        <Skeleton className="h-5 w-1/4 mb-4" />

        {/* Скелетон для заголовка сторінки */}
        <div className="mb-8">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="mt-2 h-5 w-1/2" />
        </div>

        {/* Основна сітка, що імітує реальну верстку */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Скелетон для бічної панелі фільтрів (десктоп) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <FilterPanelSkeleton />
            </div>
          </aside>

          {/* Скелетон для основного контенту */}
          <div className="lg:col-span-3">
            {/* Скелетон для панелі фільтрів (мобільні) */}
            <div className="mb-8 lg:hidden">
              <FilterPanelSkeleton />
            </div>

            {/* Скелетон для сітки товарів */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
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
