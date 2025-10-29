import { getProductsAction } from "@/features/get-products/action";
import { ProductGrid } from "@/widgets/catalog/ui/Catalog";
import { ErrorMessage } from "@/shared/ui/error-message";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/shared/ui/skeleton";
import { Metadata } from "next";

// Вмикаємо ISR (Incremental Static Regeneration)
export const revalidate = 3600;

// Генерація метаданих
export const metadata: Metadata = {
  title: "Каталог товарів | Крамниця",
  description: "Широкий вибір якісних товарів за найкращими цінами",
  openGraph: {
    title: "Каталог товарів | Крамниця",
    description: "Широкий вибір якісних товарів за найкращими цінами",
    type: "website",
  },
};

async function Products() {
  const result = await getProductsAction();

  if (!result.success) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <ErrorMessage
          title="Не вдалося завантажити товари"
          message={result.error.message}
          className="mx-auto max-w-md"
        />
      </div>
    );
  }
  return <ProductGrid products={result.data} />;
}

export default async function HomePage() {
  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Наші товари
        </h1>
        <Suspense fallback={<ProductGridSkeleton />}>
          <Products />
        </Suspense>
      </div>
    </main>
  );
}
