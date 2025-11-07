import { notFound } from "next/navigation";
import { Metadata } from "next";
import { categoryRepository } from "@/shared/api/repositories/category.repository";
import { productRepository } from "@/shared/api/repositories/product.repository";
import { ProductGrid } from "@/widgets/catalog/ui/Catalog";
import { FilterPanel } from "@/features/filter-products/ui/FilterPanel";
import { ProductFiltersSchema } from "@/entities/product/model/filter-types";
import Link from "next/link";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

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

export default async function CategoryPage(props: CategoryPageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const category = await categoryRepository.getBySlug(slug);

  if (!category) {
    notFound();
  }

  // Парсимо фільтри з URL
  const parseResult = ProductFiltersSchema.safeParse({
    categorySlug: slug,
    sort: searchParams.sort,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    search: searchParams.search,
  });

  // Якщо парсинг невдалий, використовуємо дефолтні значення
  const filters = parseResult.success
    ? parseResult.data
    : { categorySlug: slug, sort: "newest" as const };

  const products = await productRepository.getProductsFiltered(filters);

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Хлібні крихти */}
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Головна
          </Link>
          {" / "}
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Заголовок категорії */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {category.name}
          </h2>
          {category.description && (
            <p className="mt-2 text-muted-foreground">{category.description}</p>
          )}
        </div>

        {/* Фільтри та сортування */}
        <FilterPanel currentFilters={filters} />

        {/* Сітка товарів */}
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
