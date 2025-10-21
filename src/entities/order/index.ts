// Модель (типи, схеми, інтерфейси)
export {
  // Схеми
  OrderSchema,
  CreateOrderPayloadSchema,
  OrderItemSchema,
  // Enums
  PaymentMethodEnum,
  OrderStatusEnum,
  // Labels
  PaymentMethodLabels,
  OrderStatusLabels,
} from "./model/types";

// Типи
export type {
  Order,
  CreateOrderPayload,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  IOrderRepository,
} from "./model/types";

// Допоміжні функції
export { getTotalItemCount, isEligibleForFreeShipping } from "./model/helpers";

// UI компоненти
export { OrderView } from "./ui/OrderView";

// Репозиторій
export { orderRepository } from "./api/order.repository";
