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
  },
};

export default nextConfig;
