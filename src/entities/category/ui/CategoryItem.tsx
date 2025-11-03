import Link from "next/link";
import type { PublicCategory } from "@/entities/category";
import { cn } from "@/shared/lib/utils";
import {
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_ICON,
} from "../config/icons";

interface CategoryItemProps {
  category: PublicCategory;
}

export function CategoryItem({ category }: CategoryItemProps) {
  // Вибираємо іконку зі словника або використовуємо дефолтну
  const Icon = CATEGORY_ICONS[category.slug] || DEFAULT_CATEGORY_ICON;

  return (
    <Link
      key={category.id}
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 text-center"
    >
      <div
        className={cn(
          "flex size-20 items-center justify-center rounded-full bg-secondary",
          "transition-colors group-hover:bg-accent",
        )}
      >
        <Icon
          className={cn(
            "size-10 text-secondary-foreground",
            "transition-colors group-hover:text-accent-foreground",
          )}
        />
      </div>
      <span
        className={cn(
          "max-w-20 truncate text-sm font-medium text-muted-foreground",
          "transition-colors group-hover:text-accent-foreground",
        )}
      >
        {category.name}
      </span>
    </Link>
  );
}
