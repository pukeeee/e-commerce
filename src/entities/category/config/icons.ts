import {
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Tablet,
  ShoppingBag,
  Shapes,
  Monitor,
  type LucideIcon,
} from "lucide-react";

/**
 * Словник для зіставлення slug категорії з іконкою.
 * Ви можете розширити його, додавши нові категорії та відповідні іконки з lucid-react.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  macbook: Laptop,
  imac: Monitor,
  iphone: Smartphone,
  ipad: Tablet,
  "apple-watch": Watch,
  airpods: Headphones,
  accessories: ShoppingBag,
};

/**
 * Іконка за замовчуванням, якщо для категорії не знайдено відповідника.
 */
export const DEFAULT_CATEGORY_ICON = Shapes;
