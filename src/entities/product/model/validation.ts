import { z } from "zod";

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3, "Назва товару має містити принаймні 3 символи"),
  description: z.string().optional(),
  price: z.number().positive("Ціна має бути позитивним числом"),
  imageUrl: z.url("Неправильний формат URL зображення").optional(),
  isActive: z.boolean().default(true),
  createdAt: z.iso.datetime(),
});
