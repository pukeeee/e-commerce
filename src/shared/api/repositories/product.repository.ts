import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";
import type { Product, IProductRepository } from "@/entities/product";
import { CACHE_TAGS } from "@/shared/lib/cache";
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

  // Всі інші фільтри працюють з основною таблицею \`products\`
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

// --- Створення клієнта Supabase для кешованих функцій ---
// Функція-хелпер, щоб не дублювати створення клієнта в кожній кеш-функції
const createSupabaseClientForCache = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(supabaseUrl, supabaseKey);
};

// --- Кешовані версії функцій ---

const getProducts = unstable_cache(
  async () => {
    const supabase = createSupabaseClientForCache();
    return getProductsUncached(supabase);
  },
  [CACHE_TAGS.products, "all"],
  {
    revalidate: CACHE_TIMES.PRODUCTS,
    tags: [CACHE_TAGS.products],
  },
);

const getById = unstable_cache(
  async (id: string) => {
    const supabase = createSupabaseClientForCache();
    return getByIdUncached(supabase, id);
  },
  [CACHE_TAGS.products], // Базовий ключ
  {
    revalidate: CACHE_TIMES.PRODUCT_DETAIL,
    tags: [CACHE_TAGS.products],
  },
);

const getByIds = unstable_cache(
  async (ids: string[]) => {
    const supabase = createSupabaseClientForCache();
    // Сортуємо ID, щоб ключ кешу був консистентним незалежно від порядку
    const sortedIds = [...ids].sort();
    return getByIdsUncached(supabase, sortedIds);
  },
  [CACHE_TAGS.products, "batch"], // Базовий ключ
  {
    revalidate: CACHE_TIMES.PRODUCTS,
    tags: [CACHE_TAGS.products],
  },
);

const getProductsFiltered = unstable_cache(
  async (filters: ProductFilters) => {
    const supabase = createSupabaseClientForCache();
    return getProductsFilteredUncached(supabase, filters);
  },
  [CACHE_TAGS.products, "filtered"], // Базовий ключ
  {
    revalidate: CACHE_TIMES.PRODUCTS,
    tags: [CACHE_TAGS.products],
  },
);

// --- Експортований репозиторій ---

export const productRepository: IProductRepository = {
  getProducts,
  getById,
  getByIds,
  getProductsFiltered,
};
