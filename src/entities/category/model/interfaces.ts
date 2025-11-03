import { Category } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";

export interface ICategoryRepository {
  getAll(supabase: SupabaseClient): Promise<Category[]>;
  getBySlug(supabase: SupabaseClient, slug: string): Promise<Category | null>;
}
