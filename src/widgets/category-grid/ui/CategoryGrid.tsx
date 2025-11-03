import type { PublicCategory } from "@/entities/category";
import { CategoryItem } from "@/entities/category/ui/CategoryItem";

interface CategoryGridProps {
  categories: PublicCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}