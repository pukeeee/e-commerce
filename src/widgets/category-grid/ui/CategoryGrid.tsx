"use client";

import type { PublicCategory } from "@/entities/category";
import { CategoryItem } from "@/entities/category/ui/CategoryItem";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// Варіанти анімації для контейнера і дочірніх елементів
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // Затримка між анімацією кожного елемента
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 }, // Початковий стан: невидимий і зміщений вправо
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  }, // Кінцевий стан: видимий і на своїй позиції
};

interface CategoryGridProps {
  categories: PublicCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (categories.length === 0) {
    return null;
  }

  const gridClassName =
    "flex gap-x-6 overflow-x-auto pb-4 px-4 -mx-4 md:flex-wrap md:justify-center md:gap-y-8 md:overflow-visible md:p-0 md:m-0";

  // Поки компонент не змонтовано на клієнті, рендеримо просту версію без анімації.
  // Це запобігає помилці гідрації, яка ламає анімацію.
  if (!isMounted) {
    return (
      <div className={gridClassName}>
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryItem category={category} />
          </div>
        ))}
      </div>
    );
  }

  // Після монтування на клієнті, рендеримо повну версію з анімацією.
  return (
    <motion.div
      className={gridClassName}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={itemVariants}>
          <CategoryItem category={category} />
        </motion.div>
      ))}
    </motion.div>
  );
}
