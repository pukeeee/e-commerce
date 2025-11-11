import { createClient } from "@/shared/api/supabase/server";
import { unstable_cache } from "next/cache";
import type { Product, IProductRepository } from "@/entities/product";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { CACHE_TIMES } from "@/shared/config/constants";
import { handleSupabaseError } from "@/shared/lib/errors/supabase-error-handler";
import type { ProductFilters } from "@/entities/product/model/filter-types";
import { z } from "zod";

// ✅ Zod схема для runtime валідації
const ProductSchema = z.object({
  id: z.uuid(),
  created_at: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  image_url: z.url().nullable(),
  is_active: z.boolean(),
});

const FilteredProductSchema = ProductSchema.extend({
  categories: z.object({ slug: z.string() }).nullable(),
});

// ✅ Тип, виведений зі схеми
type RawProduct = z.infer<typeof ProductSchema>;

// ✅ Функція для перетворення даних з snake_case (БД) в camelCase (доменна модель)
const mapProduct = (raw: RawProduct): Product => {
  // Валідація відбувається до виклику цієї функції
  return {
    id: raw.id,
    createdAt: raw.created_at,
    name: raw.name,
    description: raw.description ?? undefined,
    price: raw.price,
    imageUrl: raw.image_url ?? undefined,
    isActive: raw.is_active,
  };
};

// --- Публічні методи репозиторію ---

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const getProductsCached = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) handleSupabaseError(error, { tableName: "products" });

      // ✅ Валідація даних
      const parsed = z.array(ProductSchema).safeParse(data);
      if (!parsed.success) {
        console.error("Invalid product data:", parsed.error);
        return [];
      }

      return parsed.data.map(mapProduct);
    },
    [CACHE_TAGS.products, "all"],
    {
      revalidate: CACHE_TIMES.PRODUCTS,
      tags: [CACHE_TAGS.products],
    },
  );
  return getProductsCached();
}

async function getById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const getByIdCached = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        handleSupabaseError(error, { tableName: "products" });
      }

      if (!data) return null;

      // ✅ Валідація даних
      const parsed = ProductSchema.safeParse(data);
      if (!parsed.success) {
        console.error(`Invalid product data for id ${id}:`, parsed.error);
        return null;
      }

      return mapProduct(parsed.data);
    },
    [CACHE_TAGS.product(id)],
    {
      revalidate: CACHE_TIMES.PRODUCT_DETAIL,
      tags: [CACHE_TAGS.product(id)],
    },
  );
  return getByIdCached();
}

async function getByIds(ids: string[]): Promise<Product[]> {
  const supabase = await createClient();
  const sortedIds = [...ids].sort();

  const getByIdsCached = unstable_cache(
    async () => {
      if (ids.length === 0) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", sortedIds)
        .eq("is_active", true);

      if (error) handleSupabaseError(error, { tableName: "products" });

      // ✅ Валідація даних
      const parsed = z.array(ProductSchema).safeParse(data);
      if (!parsed.success) {
        console.error("Invalid product data for batch ids:", parsed.error);
        return [];
      }

      return parsed.data.map(mapProduct);
    },
    [CACHE_TAGS.products, "batch", ...sortedIds],
    {
      revalidate: CACHE_TIMES.PRODUCTS,
      tags: [CACHE_TAGS.products, ...sortedIds.map(CACHE_TAGS.product)],
    },
  );
  return getByIdsCached();
}

async function getProductsFiltered(
  filters: ProductFilters,
): Promise<Product[]> {
  const supabase = await createClient();

  const cacheKey = [
    CACHE_TAGS.products,
    "filtered",
    filters.categorySlug || "all",
    filters.sort,
    filters.minPrice?.toString() || "",
    filters.maxPrice?.toString() || "",
    filters.search || "",
  ];

  const getProductsFilteredCached = unstable_cache(
    async () => {
      let query = supabase.from("products").select("*, categories!inner(slug)");
      if (filters.categorySlug)
        query = query.eq("categories.slug", filters.categorySlug);
      query = query.eq("is_active", true);
      if (filters.minPrice !== undefined)
        query = query.gte("price", filters.minPrice);
      if (filters.maxPrice !== undefined)
        query = query.lte("price", filters.maxPrice);
      if (filters.search) query = query.ilike("name", `%${filters.search}%`);

      switch (filters.sort) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "name_desc":
          query = query.order("name", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) return handleSupabaseError(error, { tableName: "products" });

      // ✅ Валідація даних
      const parsed = z.array(FilteredProductSchema).safeParse(data);
      if (!parsed.success) {
        console.error("Invalid filtered product data:", parsed.error);
        return [];
      }

      return parsed.data.map(mapProduct);
    },
    cacheKey,
    {
      revalidate: CACHE_TIMES.PRODUCTS,
      tags: [CACHE_TAGS.products],
    },
  );
  return getProductsFilteredCached();
}

// --- Експортований репозиторій ---

export const productRepository: IProductRepository = {
  getProducts,
  getById,
  getByIds,
  getProductsFiltered,
};
