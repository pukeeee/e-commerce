import z from "zod";
import { categoryRepository } from "@/shared/api/repositories/category.repository";
import { PublicCategorySchema } from "@/entities/category/model/schemas";
import { handleServerError } from "@/shared/lib/errors/error-handler";

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

const GetCategoryActionResponseSchema = z.array(PublicCategorySchema);

// Використовуємо ActionResponse для правильної типізації
export async function getCategoriesAction(): Promise<
  ActionResponse<z.infer<typeof GetCategoryActionResponseSchema>>
> {
  try {
    const categories = await categoryRepository.getAll();

    const validatedData = GetCategoryActionResponseSchema.parse(categories);

    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    return handleServerError(error);
  }
}
