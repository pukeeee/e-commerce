"use client";

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * @name imageLoader
 * @description Формує URL для нашого API оптимізації зображень.
 * @param {ImageLoaderProps} { src, width, quality }
 * @returns {string} URL для API-маршруту.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  // Формуємо URL, що вказує на наш власний API.
  // encodeURIComponent(src) - обов'язково, щоб URL картинки був безпечно переданий.
  return `/api/image?url=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }`;
}