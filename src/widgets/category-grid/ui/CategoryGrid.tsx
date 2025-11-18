"use client";

import type { PublicCategory } from "@/entities/category";
import { CategoryItem } from "@/entities/category/ui/CategoryItem";
import { useInView } from "motion/react";
import { useRef } from "react";

interface CategoryGridProps {
  categories: PublicCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  if (categories.length === 0) {
    return null;
  }

  const gridClassName =
    "flex gap-x-6 overflow-x-auto pb-4 px-4 -mx-4 md:flex-wrap md:justify-center md:gap-y-8 md:overflow-visible md:p-0 md:m-0";

  return (
    <div
      ref={ref}
      className={`relative z-10 ${gridClassName} category-grid-stagger ${
        isInView ? "is-in-view" : ""
      }`}
    >
      {categories.map((category, index) => (
        <div
          key={category.id}
          className="category-grid-item"
          // Динамічно додаємо затримку анімації
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <CategoryItem category={category} />
        </div>
      ))}
    </div>
  );
}
