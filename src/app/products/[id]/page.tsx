import { notFound } from "next/navigation";
import { Metadata } from "next";
import { productRepository } from "@/shared/api/repositories/product.repository";
import { ProductDetailView } from "@/widgets/product-detail";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await productRepository.getById(id);

  if (!product) {
    return {
      title: "Товар не знайдено",
    };
  }

  return {
    title: `${product.name} | Крамниця`,
    description:
      product.description ||
      `Купити ${product.name} в інтернет-магазині Крамниця`,
    openGraph: {
      title: `${product.name} | Крамниця`,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const { id } = await props.params;
  const product = await productRepository.getById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Хлібні крихти */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Головна
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* Основний контент */}
        <ProductDetailView product={product} />
      </div>
    </main>
  );
}
