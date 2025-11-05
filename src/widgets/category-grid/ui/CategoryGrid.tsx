"use client";

import type { PublicCategory } from "@/entities/category";
import { CategoryItem } from "@/entities/category/ui/CategoryItem";
import { useIsMobile } from "@/shared/hooks/use-media-query";
import { cn } from "@/shared/lib/utils";
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
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (categories.length === 0) {
    return null;
  }

  if (!isMounted) {
    return <div className="h-28" />;
  }

  // Після монтування рендеримо повну версію з анімацією.
  return (
    <motion.div
      className={cn(
        "flex gap-x-6",
        isMobile
          ? "overflow-x-auto pb-4 px-4 -mx-4"
          : "flex-wrap justify-center gap-y-8",
      )}
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
