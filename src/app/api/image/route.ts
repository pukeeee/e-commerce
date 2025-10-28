import { type NextRequest } from "next/server";
import sharp from "sharp";

// Дозволені домени для обробки зображень.
// Беремо їх з змінних оточення для гнучкості.
const ALLOWED_DOMAINS = [
  new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname,
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const imageUrl = searchParams.get("url");
  const width = parseInt(searchParams.get("w") || "800", 10); // 800px - дефолтний розмір
  const quality = parseInt(searchParams.get("q") || "80", 10); // 80 - дефолтна якість

  if (!imageUrl) {
    return new Response("URL parameter is required", { status: 400 });
  }

  const sourceUrl = new URL(imageUrl);
  // --- Крок безпеки ---
  // Перевіряємо, чи домен зображення є в нашому білому списку.
  if (!ALLOWED_DOMAINS.includes(sourceUrl.hostname)) {
    return new Response("Domain not allowed", { status: 403 });
  }

  try {
    // 1. Завантажуємо оригінальне зображення
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return new Response("Failed to fetch image", {
        status: imageResponse.status,
      });
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    // 2. Обробляємо за допомогою sharp
    const optimizedBuffer = await sharp(imageBuffer)
      .rotate() // Автоматично виправляє орієнтацію на основі EXIF-даних
      .resize(width) // Змінюємо ширину
      .webp({ quality }) // Конвертуємо в WebP з заданою якістю
      .toBuffer();

    // 3. Віддаємо оптимізоване зображення з правильними заголовками
    // Створюємо новий ArrayBuffer і копіюємо в нього дані з Buffer.
    // Це гарантує, що ми передаємо стандартний ArrayBuffer, а не SharedArrayBuffer,
    // вирішуючи проблему сумісності типів між Node.js і Web API.
    const arrayBuffer = new ArrayBuffer(optimizedBuffer.length);
    const view = new Uint8Array(arrayBuffer);
    view.set(optimizedBuffer);

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image optimization error:", error);
    return new Response("Failed to optimize image", { status: 500 });
  }
}
