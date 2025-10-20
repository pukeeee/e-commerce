"use server";

import { z } from "zod";
import { OrderFormSchema } from "@/entities/order/model/validation";
import { orderApi } from "@/entities/order/api/order.api";
import type { CreateOrderType } from "@/entities/order/model/types";

type FormErrors = z.ZodFormattedError<CreateOrderType>;

export const createOrderAction = async (orderData: CreateOrderType) => {
  const validationResult = OrderFormSchema.safeParse(orderData);

  if (!validationResult.success) {
    const flattenedErrors = z.flattenError(validationResult.error);

    return {
      success: false,
      errors: flattenedErrors.fieldErrors,
    };
  }

  try {
    // Викликаємо абстрактний сервіс, не знаючи про Supabase
    const newOrder = await orderApi.create(validationResult.data);
    return { success: true, order: newOrder };
  } catch {
    return {
      success: false,
      errors: {
        _errors: ["Не вдалося створити замовлення. Спробуйте ще раз."],
      } as FormErrors,
    };
  }
};
