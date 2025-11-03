import { AlertCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// Визначення типів повідомлень про помилки
type ErrorType = "error" | "warning" | "info";

// Інтерфейс для пропсів компонента ErrorMessage
interface ErrorMessageProps {
  title?: string; // Заголовок повідомлення (опціонально, за замовчуванням "Помилка")
  message: string; // Основний текст повідомлення
  type?: ErrorType; // Тип повідомлення (error, warning, info), за замовчуванням "error"
  className?: string; // Додаткові класи CSS для стилізації
  onDismiss?: () => void; // Функція зворотного виклику для закриття повідомлення
}

// Об'єкт, що містить іконки для різних типів повідомлень
const icons = {
  error: XCircle, // Іконка для помилки
  warning: AlertTriangle, // Іконка для попередження
  info: AlertCircle, // Іконка для інформації
};

// Об'єкт, що містить стилі Tailwind CSS для різних типів повідомлень
const styles = {
  error: "border-destructive/50 bg-destructive/10 text-destructive", // Стилі для помилки
  warning: "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400", // Стилі для попередження
  info: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400", // Стилі для інформації
};

/**
 * Компонент для відображення повідомлень про помилки, попередження або інформації.
 * Підтримує різні типи, іконки та можливість закриття.
 */
export function ErrorMessage({
  title = "Помилка", // Заголовок за замовчуванням
  message, // Текст повідомлення
  type = "error", // Тип за замовчуванням
  className, // Додаткові класи
  onDismiss, // Функція закриття
}: ErrorMessageProps) {
  // Вибір відповідної іконки на основі типу повідомлення
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "rounded-lg border p-4", // Базові стилі для контейнера
        styles[type], // Стилі, специфічні для типу повідомлення
        className // Додаткові класи, передані через пропси
      )}
      role="alert" // Роль для доступності
    >
      <div className="flex gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" /> {/* Іконка повідомлення */}
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3> {/* Заголовок */}
          <p className="mt-1 text-sm opacity-90">{message}</p> {/* Текст повідомлення */}
        </div>
        {onDismiss && ( // Якщо надана функція onDismiss, показуємо кнопку закриття
          <button
            onClick={onDismiss}
            className="ml-auto flex-shrink-0 opacity-70 hover:opacity-100"
            aria-label="Закрити" // Атрибут для доступності
          >
            <XCircle className="h-4 w-4" /> {/* Іконка закриття */}
          </button>
        )}
      </div>
    </div>
  );
}
