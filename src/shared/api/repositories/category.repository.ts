import type { Category, ICategoryRepository } from "@/entities/category";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { CACHE_TIMES } from "@/shared/config/constants";
import { handleSupabaseError } from "@/shared/lib/errors/supabase-error-handler";
import { createClient } from "@/shared/api/supabase/server";
import { unstable_cache } from "next/cache";

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

// --- Публічні методи репозиторію ---

async function getAll(): Promise<Category[]> {
  const supabase = await createClient();

  const getAllCached = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        return handleSupabaseError(error, { tableName: "categories" });
      }
      return (data as RawCategory[] | null)?.map(mapCategory) ?? [];
    },
    // ✅ Ключ кешу тепер унікальний для користувача (або 'anon' для всіх анонімів)
    [CACHE_TAGS.categories],
    {
      revalidate: CACHE_TIMES.CATEGORIES,
      tags: [CACHE_TAGS.categories],
    },
  );

  return getAllCached();
}

async function getBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const getBySlugCached = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        return handleSupabaseError(error, { tableName: "categories" });
      }
      return data ? mapCategory(data as RawCategory) : null;
    },
    // ✅ Ключ кешу тепер унікальний для slug ТА користувача
    [CACHE_TAGS.category(slug)],
    {
      revalidate: CACHE_TIMES.CATEGORIES,
      tags: [CACHE_TAGS.category(slug)],
    },
  );

  return getBySlugCached();
}

export const categoryRepository: ICategoryRepository = {
  getAll,
  getBySlug,
};
