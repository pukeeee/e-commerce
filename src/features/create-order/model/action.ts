"use server";

import { z } from "zod";
import {
  CreateOrderPayloadSchema,
  type CreateOrderPayload,
} from "@/entities/order";
import { orderRepository } from "@/entities/order/api/order.repository";

type FormErrors = z.ZodFormattedError<CreateOrderPayload>;

export const createOrderAction = async (orderData: CreateOrderPayload) => {
  const validationResult = CreateOrderPayloadSchema.safeParse(orderData);

  if (!validationResult.success) {
    const flattenedErrors = z.flattenError(validationResult.error);

    return {
      success: false,
      errors: flattenedErrors.fieldErrors,
    };
  }

  try {
    const newOrder = await orderRepository.create(validationResult.data);

    return {
      success: true as const,
      order: newOrder,
    };
  } catch (error) {
    console.error("Order creation failed:", error);

    return {
      success: false as const,
      errors: {
        _errors: ["Не вдалося створити замовлення. Спробуйте ще раз."],
      } as FormErrors,
    };
  }
};
