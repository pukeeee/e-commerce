import { z } from "zod";
import {
  OrderSchema,
  CreateOrderPayloadSchema,
  OrderItemSchema,
} from "./schemas";
import { PaymentMethodEnum, OrderStatusEnum } from "./enums";

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderPayload = z.infer<typeof CreateOrderPayloadSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
