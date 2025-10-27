import { PublicProduct } from "@/entities/product";

// Явний тип для успішної відповіді
export type GetProductsSuccessResponse = {
  success: true;
  data: PublicProduct[];
};

// Явний тип для відповіді з помилкою
export type GetProductsErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

// Об'єднаний тип, який описує всі можливі відповіді
export type GetProductsActionResponse =
  | GetProductsSuccessResponse
  | GetProductsErrorResponse;
