import type { PublicProduct } from "@/entities/product";

/**
 * Базовий інтерфейс для компонентів, які працюють з товаром
 */
export interface CartItemProps {
  product: PublicProduct;
}

/**
 * Пропси для кнопок додавання в кошик
 */
export interface AddToCartBaseProps extends CartItemProps {
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "secondary" | "outline" | "ghost";
}

/**
 * Пропси для каунтера
 */
export interface QuantityControlProps {
  productId: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  showValue?: boolean;
  min?: number;
  max?: number;
}

/**
 * Пропси для кнопки видалення
 */
export interface RemoveFromCartProps {
  productId: string;
  className?: string;
  variant?: "icon" | "text" | "ghost";
  size?: "default" | "sm" | "icon";
  onRemove?: () => void;
}

/**
 * Пропси для кнопки очищення
 */
export interface ClearCartProps {
  className?: string;
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm" | "lg";
  onClear?: () => void;
  confirmationRequired?: boolean;
}
