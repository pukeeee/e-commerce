import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, ICategoryRepository } from "@/entities/category";
import { CACHE_TAGS, createCachedFunction } from "@/shared/lib/cache";
import { CACHE_TIMES } from "@/shared/config/constants";
import { handleSupabaseError } from "@/shared/lib/errors/supabase-error-handler";

type RawCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

const mapCategory = (raw: RawCategory): Category => ({
  id: raw.id,
  slug: raw.slug,
  name: raw.name,
  description: raw.description ?? undefined,
  displayOrder: raw.display_order,
  isActive: raw.is_active,
  createdAt: raw.created_at,
});

async function getAllUncached(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    // handleSupabaseError повертає never, але для ясності можна додати return
    return handleSupabaseError(error, { tableName: "categories" });
  }

  // 2. Використовуємо type assertion (`as`) - просто і без попереджень
  const typedData = data as RawCategory[] | null;

  return typedData ? typedData.map(mapCategory) : [];
}

async function getBySlugUncached(
  supabase: SupabaseClient,
  slug: string,
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle(); // 3. maybeSingle() - ідеально для "один або null"

  if (error) {
    return handleSupabaseError(error, { tableName: "categories" });
  }

  const typedData = data as RawCategory | null;

  return typedData ? mapCategory(typedData) : null;
}

const getAll = (supabase: SupabaseClient) =>
  createCachedFunction(
    () => getAllUncached(supabase),
    [CACHE_TAGS.categories],
    {
      revalidate: CACHE_TIMES.CATEGORIES,
      tags: [CACHE_TAGS.categories],
    },
  )();

const getBySlug = (supabase: SupabaseClient, slug: string) =>
  createCachedFunction(
    () => getBySlugUncached(supabase, slug),
    [CACHE_TAGS.category(slug)],
    {
      revalidate: CACHE_TIMES.CATEGORIES,
      tags: [CACHE_TAGS.categories, CACHE_TAGS.category(slug)],
    },
  )();

export const categoryRepository: ICategoryRepository = {
  getAll,
  getBySlug,
};
