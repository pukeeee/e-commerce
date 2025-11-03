import { z } from "zod";

export const CategorySchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.iso.datetime(),
});

export const PublicCategorySchema = CategorySchema.pick({
  id: true,
  slug: true,
  name: true,
  description: true,
});
