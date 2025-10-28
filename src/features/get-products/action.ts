"use server";

import { productRepository } from "@/shared/api/repositories/product.repository";
import { handleServerError } from "@/shared/lib/errors/error-handler";
import { PublicProductSchema } from "@/entities/product";
import { z } from "zod";
import { GetProductsActionResponse } from "./types";
import { createClient } from "@/shared/api/supabase/server";

// Визначаємо схему відповіді, щоб гарантувати, що ми повертаємо лише публічні дані
const GetProductsActionResponseSchema = z.array(PublicProductSchema);

/**
 * @feature getProducts
 * @description Server Action для отримання списку публічних товарів.
 */
export async function getProductsAction(): Promise<GetProductsActionResponse> {
  try {
    const supabase = await createClient();
    const products = await productRepository.getProducts(supabase);

    // Валідуємо дані перед відправкою на клієнт, щоб переконатись,
    // що вони відповідають публічному контракту.
    const validatedProducts = GetProductsActionResponseSchema.parse(products);

    return {
      success: true,
      data: validatedProducts,
    };
  } catch (error) {
    // Використовуємо наш централізований обробник помилок
    return handleServerError(error);
  }
}
