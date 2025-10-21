/**
 * @file Public API for the Product entity
 * @description Aggregates and exports all necessary modules for external use.
 */

// Модель (типи, схеми, інтерфейси)
export { ProductSchema, PublicProductSchema } from "./model/types";

export type { Product, PublicProduct, IProductRepository } from "./model/types";

// Репозиторій
export { productRepository } from "./api/product.repository";

// UI компоненти (приклад, буде додано пізніше)
// export { ProductCard } from "./ui/ProductCard";
