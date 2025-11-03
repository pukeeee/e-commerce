import { z } from "zod";

export const SortOptionEnum = z.enum([
  "newest",
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
]);

export type SortOption = z.infer<typeof SortOptionEnum>;

export const ProductFiltersSchema = z.object({
  categorySlug: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().optional(),
  sort: SortOptionEnum.default("newest"),
});

export type ProductFilters = z.infer<typeof ProductFiltersSchema>;

export const SORT_OPTIONS: Record<SortOption, string> = {
  newest: "Новинки",
  price_asc: "Ціна: за зростанням",
  price_desc: "Ціна: за спаданням",
  name_asc: "Назва: А-Я",
  name_desc: "Назва: Я-А",
};
