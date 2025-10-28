"use server";

import { z } from "zod";
import {
  CreateOrderPayloadSchema,
  type CreateOrderPayload,
} from "@/entities/order";
import { orderRepository } from "@/shared/api/repositories/order.repository";
import { handleServerError } from "@/shared/lib/errors/error-handler";

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
    return handleServerError(error);
  }
};
