"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/ui/theme";

/**
 * @widget MobileMenuSheet
 * @description Віджет, що реалізує бічне мобільне меню (бургер-меню).
 */
export function MobileMenuSheet() {
  return (
    // Використовуємо той самий Sheet, що і для кошика
    <Sheet>
      {/* Тригер - це кнопка з іконкою "бургера" */}
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Відкрити меню</span>
        </Button>
      </SheetTrigger>

      {/* Вміст, що виїжджає. Вказуємо `side="left"` */}
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader className="px-8 pt-6">
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>

        {/* Основний вміст меню */}
        <div className="flex flex-col gap-2 flex-1 px-4 py-4 ">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-base"
          >
            <Link href="/">Каталог</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-base"
          >
            <Link href="/contacts">Контакти</Link>
          </Button>
          {/* Сюди можна додавати інші посилання в майбутньому */}
        </div>

        {/* Футер меню, де буде перемикач теми */}
        <SheetFooter className="px-6 pb-6">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-muted-foreground">Змінити тему</span>
            <ThemeToggle />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
