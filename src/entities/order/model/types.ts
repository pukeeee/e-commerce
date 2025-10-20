import { z } from "zod";
import {
  OrderFormSchema,
  OrderItemSchema,
  PaymentMethodEnum,
} from "./validation";

export type CreateOrderType = z.infer<typeof OrderFormSchema>;
export type OrderItemType = z.infer<typeof OrderItemSchema>;

export type PaymentMethodType = keyof typeof PaymentMethodEnum;
