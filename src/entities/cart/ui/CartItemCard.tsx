"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { formatPrice } from "@/shared/lib/utils";
import type { CartItem } from "../model/types";

interface CartItemCardProps {
  item: CartItem;
  className?: string;
  /** Слот для елементів керування кількістю товару */
  quantityControl?: React.ReactNode;
  /** Слот для кнопки видалення товару */
  removeControl?: React.ReactNode;
}

/**
 * @description
 * Картка товару для відображення в кошику.
 * Відповідає виключно за візуальне представлення даних про товар.
 * Елементи керування (зміна кількості, видалення) передаються через слоти.
 *
 * @param {CartItemCardProps} props - Пропси компонента.
 */
export const CartItemCard = ({
  item,
  className,
  quantityControl,
  removeControl,
}: CartItemCardProps) => {
  // Використовуємо плейсхолдер, якщо зображення відсутнє
  const imageUrl = item.imageUrl || "/images/placeholder.svg";

  return (
    <div className={cn("flex items-start gap-4 py-4", className)}>
      {/* Зображення товару */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          className="object-cover object-center"
          sizes="96px"
          loading="lazy"
        />
      </div>

      {/* Основна інформація */}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-semibold leading-tight">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.price)}
        </p>
        {/* Слот для кнопок "+", "-" та лічильника */}
        {quantityControl}
      </div>

      {/* Ціна та кнопка видалення */}
      <div className="flex flex-col items-end justify-between self-stretch">
        {/* Слот для кнопки "видалити" */}
        {removeControl}
        <p className="mt-auto font-semibold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
};
