"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Інтегрувати сервіс логування (Sentry, DataDog, etc.)
    console.error("Application error boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <div>
        <h2 className="text-2xl font-bold">Щось пішло не так</h2>
        <p className="mt-2 text-muted-foreground">
          На жаль, сталася непередбачена помилка. Ми вже працюємо над її
          вирішенням.
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium">
              Технічні деталі
            </summary>
            <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-xs">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
      <Button onClick={reset}>Спробувати ще раз</Button>
    </div>
  );
}
