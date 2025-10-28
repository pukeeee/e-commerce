import { getProductsAction } from "@/features/get-products/action";
import { ProductGrid } from "@/widgets/catalog/ui/Catalog";
import { ErrorMessage } from "@/shared/ui/error-message";

export default async function HomePage() {
  const result = await getProductsAction();

  // Спочатку обробляємо випадок помилки
  if (!result.success) {
    return (
      <main className="py-8">
        <div className="container mx-auto flex h-[60vh] items-center justify-center px-4 sm:px-6 lg:px-8">
          <ErrorMessage
            title="Не вдалося завантажити товари"
            message={result.error.message}
            className="mx-auto max-w-md"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Наші товари
        </h1>
        <ProductGrid products={result.data} />
      </div>
    </main>
  );
}
