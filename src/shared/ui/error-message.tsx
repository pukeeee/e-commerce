import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

/**
 * Компонент для відображення повідомлення про помилку в UI.
 */
export function ErrorMessage({
  title = "Помилка",
  message,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-destructive/50 bg-destructive/10 p-4",
        className,
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
