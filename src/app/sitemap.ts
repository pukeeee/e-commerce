import type { MetadataRoute } from "next";
import { productRepository } from "@/shared/api/repositories/product.repository";
import { categoryRepository } from "@/shared/api/repositories/category.repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  let productUrls: MetadataRoute.Sitemap = [];
  let categoryUrls: MetadataRoute.Sitemap = [];

  try {
    const [products, categories] = await Promise.all([
      productRepository.getProducts(),
      categoryRepository.getAll(),
    ]);

    productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(category.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Failed to generate dynamic sitemap paths:", error);
    // Повертаємо тільки статичні сторінки, якщо дані не завантажились
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
