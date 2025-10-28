"use server";

import { z } from "zod";
import { productRepository } from "@/shared/api/repositories/product.repository";
import { handleServerError } from "@/shared/lib/errors/error-handler";
import { PublicProductSchema } from "@/entities/product";
import type { GetProductsByIdsActionResponse } from "./types";
import { createClient } from "@/shared/api/supabase/server";

// Схема для валідації вхідних даних
const InputSchema = z.array(z.uuid());
const ResponseSchema = z.array(PublicProductSchema);

/**
 * @feature get-products-by-ids
 * @description Server Action для отримання списку товарів за їх ID.
 * Використовується для синхронізації кошика.
 */
export async function getProductsByIdsAction(
  productIds: string[],
): Promise<GetProductsByIdsActionResponse> {
  try {
    // Валідуємо вхідні дані
    const validatedProductIds = InputSchema.parse(productIds);

    // Якщо ID не передано, повертаємо порожній масив
    if (validatedProductIds.length === 0) {
      return { success: true, data: [] };
    }

    const supabase = await createClient();
    const products = await productRepository.getByIds(
      supabase,
      validatedProductIds,
    );

    // Валідуємо дані перед відправкою на клієнт
    const validatedProducts = ResponseSchema.parse(products);

    return {
      success: true,
      data: validatedProducts,
    };
  } catch (error) {
    return handleServerError(error);
  }
}
