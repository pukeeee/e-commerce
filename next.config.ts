import type { NextConfig } from "next";

const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseUrl.hostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Вказуємо Next.js, що ми використовуємо кастомний завантажувач.
    loader: "custom",
    // Вказуємо шлях до файлу з логікою нашого завантажувача.
    loaderFile: "./src/shared/lib/image-loader.ts",
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
    ],
  },
};

export default nextConfig;
