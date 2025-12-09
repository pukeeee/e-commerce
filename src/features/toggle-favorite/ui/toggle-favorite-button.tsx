"use client";

import React from "react";
import { useIsFavorite, useToggleFavorite } from "@/entities/wishlist";
import { cn } from "@/shared/lib/utils";

// Проста іконка серця як SVG-компонент
const HeartIcon = ({
  isFavorite,
  ...props
}: React.SVGProps<SVGSVGElement> & { isFavorite: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={isFavorite ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19.5 12.572l-7.5 7.428-7.5-7.428a5 5 0 1 1 7.5-6.566 5 5 0 1 1 7.5 6.566z" />
  </svg>
);

interface ToggleFavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
}

export const ToggleFavoriteButton = ({
  productId,

  className,

  ...props
}: ToggleFavoriteButtonProps) => {
  const isFavorite = useIsFavorite(productId);

  const toggleFavorite = useToggleFavorite();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Зупиняємо спливання події, щоб не перейти на сторінку товару при кліку

    toggleFavorite(productId);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isFavorite ? "Видалити з обраного" : "Додати в обране"}
      className={cn(
        "group flex items-center justify-center p-2 select-none [-webkit-tap-highlight-color:transparent] transition-colors duration-200",

        {
          "text-primary": isFavorite,

          "text-gray-400 hover:text-primary active:text-primary": !isFavorite,
        },

        className,
      )}
      {...props}
    >
      <HeartIcon
        isFavorite={isFavorite}
        className="h-6 w-6 transition-transform duration-200 ease-in-out group-hover:scale-115"
      />
    </button>
  );
};
