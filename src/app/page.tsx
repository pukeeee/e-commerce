import { getProductRepository } from "@/shared/api/repositories/product.repository";
import { AddToCartButton } from "@/features/add-to-cart";
import Image from "next/image";

export default async function Home() {
  // Спочатку отримуємо екземпляр репозиторію
  const productRepository = await getProductRepository();
  // А потім вже викликаємо його методи
  const products = await productRepository.getProducts();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Наші товари</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "2rem",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #eaeaea",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {product.imageUrl && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%", // Співвідношення сторін 1:1
                }}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div style={{ padding: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                {product.name}
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  marginTop: "0.5rem",
                }}
              >
                {product.price} грн
              </p>
              <div style={{ marginTop: "1rem" }}>
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
