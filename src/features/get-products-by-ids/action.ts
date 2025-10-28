"use server";

import { z } from "zod";
import { getProductRepository } from "@/shared/api/repositories/product.repository";
import { handleServerError } from "@/shared/lib/errors/error-handler";
import { PublicProductSchema } from "@/entities/product";
import type { GetProductsByIdsActionResponse } from "./types";

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
    // Якщо ID не передано, повертаємо порожній масив
    if (productIds.length === 0) {
      return { success: true, data: [] };
    }

    const productRepository = await getProductRepository();
    const products = await productRepository.getByIds(productIds);

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
