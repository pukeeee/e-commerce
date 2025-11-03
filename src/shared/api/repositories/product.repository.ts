import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product, IProductRepository } from "@/entities/product";
import { CACHE_TAGS, createCachedFunction } from "@/shared/lib/cache";
import { CACHE_TIMES } from "@/shared/config/constants";
import { handleSupabaseError } from "@/shared/lib/errors/supabase-error-handler";
import type { ProductFilters } from "@/entities/product/model/filter-types";

// Проміжний тип для сирих даних з Supabase, оскільки поля в БД у snake_case
type RawProduct = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
};

type RawFilteredProduct = RawProduct & {
  categories: { slug: string } | null;
};

// Функція для перетворення даних з snake_case (БД) в camelCase (доменна модель)
const mapProduct = (raw: RawProduct): Product => ({
  id: raw.id,
  createdAt: raw.created_at,
  name: raw.name,
  description: raw.description ?? undefined,
  price: raw.price,
  imageUrl: raw.image_url ?? undefined,
  isActive: raw.is_active,
});

// --- Функції для отримання даних (некешовані) ---

async function getProductsUncached(
  supabase: SupabaseClient,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    handleSupabaseError(error, { tableName: "products" });
  }

  return data.map(mapProduct);
}

async function getByIdUncached(
  supabase: SupabaseClient,
  id: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found is not an error
    handleSupabaseError(error, { tableName: "products" });
  }

  return mapProduct(data);
}

async function getByIdsUncached(
  supabase: SupabaseClient,
  ids: string[],
): Promise<Product[]> {
  if (ids.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .eq("is_active", true);

  if (error) {
    handleSupabaseError(error, { tableName: "products" });
  }

  return data.map(mapProduct);
}

async function getProductsFilteredUncached(
  supabase: SupabaseClient,
  filters: ProductFilters,
): Promise<Product[]> {
  // 1. Починаємо запит з select. Ми не будемо додавати join тут.
  let query = supabase.from("products").select("*, categories!inner(slug)");

  // 2. Фільтр по категорії через join-таблицю
  if (filters.categorySlug) {
    query = query.eq("categories.slug", filters.categorySlug);
  }

  // Всі інші фільтри працюють з основною таблицею `products`
  query = query.eq("is_active", true);

  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  // Сортування
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
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  // 3. Виконуємо запит і типізуємо результат
  const { data, error } = await query;

  if (error) {
    return handleSupabaseError(error, { tableName: "products" });
  }

  const typedData = data as RawFilteredProduct[] | null;

  return typedData ? typedData.map(mapProduct) : [];
}
// --- Кешовані версії функцій ---

const getProducts = (supabase: SupabaseClient) =>
  createCachedFunction(
    () => getProductsUncached(supabase),
    [CACHE_TAGS.products, "all"],
    {
      revalidate: CACHE_TIMES.PRODUCTS,
      tags: [CACHE_TAGS.products],
    },
  )();

const getById = (supabase: SupabaseClient, id: string) =>
  createCachedFunction(
    () => getByIdUncached(supabase, id),
    [CACHE_TAGS.product(id)],
    {
      revalidate: CACHE_TIMES.PRODUCT_DETAIL,
      tags: [CACHE_TAGS.products, CACHE_TAGS.product(id)],
    },
  )();

const getByIds = (supabase: SupabaseClient, ids: string[]) => {
  // Сортуємо ID, щоб ключ кешу був консистентним незалежно від порядку
  const sortedIds = [...ids].sort();
  return createCachedFunction(
    () => getByIdsUncached(supabase, sortedIds),
    [CACHE_TAGS.products, "batch", ...sortedIds],
    {
      revalidate: CACHE_TIMES.PRODUCTS,
      tags: [CACHE_TAGS.products, ...sortedIds.map(CACHE_TAGS.product)],
    },
  )();
};

const getProductsFiltered = (
  supabase: SupabaseClient,
  filters: ProductFilters,
) => {
  const cacheKey = [
    CACHE_TAGS.products,
    "filtered",
    filters.categorySlug || "all",
    filters.sort,
    filters.minPrice?.toString() || "",
    filters.maxPrice?.toString() || "",
    filters.search || "",
  ];

  return createCachedFunction(
    () => getProductsFilteredUncached(supabase, filters),
    cacheKey,
    {
      revalidate: CACHE_TIMES.PRODUCTS,
      tags: [CACHE_TAGS.products],
    },
  )();
};

// --- Експортований репозиторій ---

export const productRepository: IProductRepository = {
  getProducts: getProducts,
  getById: getById,
  getByIds: getByIds,
  getProductsFiltered,
};
