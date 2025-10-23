import { z } from "zod";
import { ProductSchema, PublicProductSchema } from "./schemas";

/**
 * @description Повний тип товару для внутрішнього використання (сервер, репозиторій).
 */
export type Product = z.infer<typeof ProductSchema>;

/**
 * @description Публічний тип товару для відображення на клієнті.
 */
export type PublicProduct = z.infer<typeof PublicProductSchema>;
