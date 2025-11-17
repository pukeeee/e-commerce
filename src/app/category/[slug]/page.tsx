import { notFound } from "next/navigation";
import { Metadata } from "next";
import { categoryRepository } from "@/shared/api/repositories/category.repository";
import { productRepository } from "@/shared/api/repositories/product.repository";
import { ProductGrid } from "@/widgets/catalog/ui/Catalog";
import { FilterPanel } from "@/features/filter-products/ui/FilterPanel";
import { ProductFiltersSchema } from "@/entities/product/model/filter-types";
import Link from "next/link";

// Налаштування кешування: сторінка буде перегенерована кожну годину.
export const revalidate = 3600;
// Примусовий динамічний рендеринг для врахування параметрів пошуку.
export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Генерує метадані для сторінки категорії (title, description).
 * Дані завантажуються асинхронно.
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryRepository.getBySlug(slug);

  if (!category) {
    return {
      title: "Категорія не знайдена",
    };
  }

  return {
    title: `${category.name} | Крамниця`,
    description:
      category.description ||
      `Купити ${category.name} в інтернет-магазині Крамниця`,
    openGraph: {
      title: `${category.name} | Крамниця`,
      description: category.description,
    },
  };
}

/**
 * @page CategoryPage
 * @description
 * Серверний компонент, що відображає сторінку конкретної категорії товарів.
 * Отримує дані про категорію та товари на основі slug та параметрів пошуку з URL.
 * Має адаптивну верстку для мобільних та десктопних пристроїв.
 */
export default async function CategoryPage(props: CategoryPageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  // 1. Отримання даних про категорію
  const category = await categoryRepository.getBySlug(slug);

  if (!category) {
    notFound(); // Якщо категорія не знайдена, показуємо 404 сторінку.
  }

  // 2. Валідація та парсинг параметрів фільтрації з URL
  const parseResult = ProductFiltersSchema.safeParse({
    categorySlug: slug,
    sort: searchParams.sort,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    search: searchParams.search,
  });

  // Якщо параметри невалідні, використовуються значення за замовчуванням.
  const filters = parseResult.success
    ? parseResult.data
    : { categorySlug: slug, sort: "newest" as const };

  // 3. Отримання відфільтрованих товарів
  const products = await productRepository.getProductsFiltered(filters);

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Навігація "хлібні крихти" */}
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Головна
          </Link>
          {" / "}
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Заголовок та опис категорії */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {category.name}
          </h2>
          {category.description && (
            <p className="mt-2 text-muted-foreground">{category.description}</p>
          )}
        </div>

        {/* Основна сітка сторінки: фільтри зліва, контент справа (на десктопі) */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* 
            Колонка з фільтрами для десктопних пристроїв.
            Видима тільки на екранах `lg` і більше.
            `sticky` забезпечує "прилипання" панелі при скролі.
          */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <FilterPanel currentFilters={filters} />
            </div>
          </aside>

          {/* 
            Основний контент: фільтри для мобільних та сітка товарів.
            Займає 3 з 4 колонок на екранах `lg` і більше.
          */}
          <div className="lg:col-span-3">
            {/* 
              Панель фільтрів для мобільних та планшетних пристроїв.
              Прихована на екранах `lg` і більше.
              Це окремий екземпляр компонента для гнучкості в майбутньому (напр. для модального вікна).
            */}
            <div className="mb-8 lg:hidden">
              <FilterPanel currentFilters={filters} />
            </div>

            {/* Сітка з товарами */}
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </main>
  );
}
