"use server";

import { getProductRepository } from "@/shared/api/repositories/product.repository";
import { handleServerError } from "@/shared/lib/errors/error-handler";
import { PublicProductSchema } from "@/entities/product";
import { z } from "zod";

// Визначаємо схему відповіді, щоб гарантувати, що ми повертаємо лише публічні дані
const GetProductsActionResponseSchema = z.array(PublicProductSchema);

/**
 * @feature getProducts
 * @description Server Action для отримання списку публічних товарів.
 */
export async function getProductsAction() {
  try {
    const productRepository = await getProductRepository();
    const products = await productRepository.getProducts();

    // Валідуємо дані перед відправкою на клієнт, щоб переконатись,
    // що вони відповідають публічному контракту.
    const validatedProducts = GetProductsActionResponseSchema.parse(products);

    return {
      success: true as const,
      data: validatedProducts,
    };
  } catch (error) {
    // Використовуємо наш централізований обробник помилок
    return handleServerError(error);
  }
}
