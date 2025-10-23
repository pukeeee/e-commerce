import Link from "next/link";
import { Button } from "@/shared/ui/button";

/**
 * @page not-found
 * @description Кастомна сторінка 404, яка відображається, коли маршрут не знайдено.
 */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center mt-32">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-2xl font-medium">Сторінку не знайдено</p>
      <p className="text-muted-foreground">
        На жаль, ми не змогли знайти сторінку, яку ви шукаєте.
      </p>
      <Button asChild>
        <Link href="/">Повернутися на головну</Link>
      </Button>
    </div>
  );
}
