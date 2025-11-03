import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// Інтерфейс для пропсів компонента LoadingOverlay
interface LoadingOverlayProps {
  isLoading: boolean; // Чи показувати оверлей завантаження
  message?: string; // Повідомлення, що відображається під час завантаження
  className?: string; // Додаткові класи CSS для стилізації
}

/**
 * Компонент, що відображає оверлей завантаження поверх вмісту.
 * Використовується для блокування взаємодії та індикації процесу.
 */
export function LoadingOverlay({
  isLoading, // Стан завантаження
  message = "Завантаження...", // Повідомлення за замовчуванням
  className, // Додаткові класи
}: LoadingOverlayProps) {
  // Якщо isLoading false, компонент не відображається
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm", // Базові стиліоверлея
        className, // Додаткові класи, передані через пропси
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />{" "}
      {/* Іконка спінера */}
      <p className="text-sm text-muted-foreground">{message}</p>{" "}
      {/* Текст повідомлення */}
    </div>
  );
}
