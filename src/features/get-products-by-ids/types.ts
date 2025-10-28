import { PublicProduct } from "@/entities/product";

export type GetProductsByIdsSuccessResponse = {
  success: true;
  data: PublicProduct[];
};

export type GetProductsByIdsErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type GetProductsByIdsActionResponse =
  | GetProductsByIdsSuccessResponse
  | GetProductsByIdsErrorResponse;
