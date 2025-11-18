/**
 * @feature cart-management
 * @description Універсальна система управління кошиком
 *
 * Компоненти:
 * - AddToCartButton: Кнопка → Каунтер (для карток товарів)
 * - AddToCartSimple: Кнопка → Відкрити кошик (для швидкого оформлення)
 * - CartItemQuantity: Каунтер +/- (універсальний)
 * - RemoveFromCart: Видалити товар
 * - ClearCart: Очистити весь кошик
 *
 * Хуки:
 * - useCartItem: Робота з конкретним товаром
 * - useCartActions: Глобальні операції
 */

// Компоненти
export { AddToCartButton } from "./ui/AddToCartButton";
export { AddToCartSimple } from "./ui/AddToCartSimple";
export { CartItemQuantity } from "./ui/CartItemQuantity";
export { RemoveFromCart } from "./ui/RemoveFromCart";
export { ClearCart } from "./ui/ClearCart";

// Хуки
export { useCartItem, useCartActions } from "./lib/use-cart-item";

// Типи
export type {
  CartItemProps,
  AddToCartBaseProps,
  QuantityControlProps,
  RemoveFromCartProps,
  ClearCartProps,
} from "./types";
