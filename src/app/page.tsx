import { getProductsAction } from "@/features/get-products/action";
import { ProductGrid } from "@/widgets/catalog/ui/Catalog";
import { ErrorMessage } from "@/shared/ui/error-message";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/shared/ui/skeleton";
import { Metadata } from "next";
import { CategoryGrid } from "@/widgets/category-grid/ui/CategoryGrid";
import { getCategoriesAction } from "@/features/get-categories/model/action";
import { HeroSection } from "@/widgets/hero-section";
import { SectionHeading } from "@/shared/ui/section-heading";

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

async function Categories() {
  // 1. Отримуємо об'єкт-результат
  const result = await getCategoriesAction();

  // 2. Перевіряємо, чи операція неуспішна
  if (!result.success) {
    // Можна повернути компонент з помилкою для користувача
    return (
      <ErrorMessage
        title="Не вдалося завантажити категорії"
        message={result.error.message}
      />
    );
  }

  // 3. Якщо все добре, передаємо в Grid саме result.data
  return <CategoryGrid categories={result.data} />;
}

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
        {/* Hero секція */}
        <HeroSection />

        {/* Категорії */}
        <section className="mb-16">
          <SectionHeading className="text-2xl font-bold mb-6">
            Категорії
          </SectionHeading>
          <Suspense fallback={<div className="h-28" />}>
            <Categories />
          </Suspense>
        </section>

        <SectionHeading className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Всі товари
        </SectionHeading>
        <Suspense fallback={<ProductGridSkeleton />}>
          <Products />
        </Suspense>
      </div>
    </main>
  );
}
