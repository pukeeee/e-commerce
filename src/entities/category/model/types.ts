import { z } from "zod";
import { CategorySchema, PublicCategorySchema } from "./schemas";

export type Category = z.infer<typeof CategorySchema>;
export type PublicCategory = z.infer<typeof PublicCategorySchema>;
