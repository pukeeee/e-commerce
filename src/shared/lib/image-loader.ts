"use client";

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Оптимізований завантажувач зображень для Supabase Storage.
 * Використовує вбудований Image Transformation API.
 * @see https://supabase.com/docs/guides/storage/serving/image-transformations
 */
export default function imageLoader({
  src,
  width,
  quality = 80,
}: ImageLoaderProps): string {
  // Перевіряємо, чи це URL зі Supabase Storage
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "url";

  if (!src.startsWith(supabaseUrl)) {
    // Якщо це не URL від Supabase, повертаємо як є
    return src;
  }

  try {
    const url = new URL(src);

    // Перевіряємо, чи це публічний bucket
    if (url.pathname.includes("/storage/v1/object/public/")) {
      // Замінюємо /object/public/ на /render/image/public/
      const transformPath = url.pathname.replace(
        "/storage/v1/object/public/",
        "/storage/v1/render/image/public/",
      );

      // Додаємо параметри трансформації
      const params = new URLSearchParams({
        width: width.toString(),
        quality: quality.toString(),
        resize: "contain", // або 'cover', 'fill'
        // format: "webp", // Supabase автоматично визначає найкращий формат
      });

      return `${url.origin}${transformPath}?${params.toString()}`;
    }
  } catch (error) {
    console.error("Error transforming image URL:", error);
  }

  // Fallback на оригінальний URL
  return src;
}
