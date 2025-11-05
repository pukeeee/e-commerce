"use client";

import { Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useState, useEffect, useTransition, useRef } from "react";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { Skeleton } from "@/shared/ui/skeleton";
import type { Product } from "@/entities/product";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { searchProducts } from "@/features/search-products/model/action";

// Компонент для відображення результатів, поки що простий
const SearchResults = ({
  products,
  isLoading,
  onClose,
}: {
  products: Product[];
  isLoading: boolean;
  onClose: () => void;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  // TODO: Замінити на красиві картки товарів та обгорнути в Link
  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={onClose}
          className="p-2 border rounded-md cursor-pointer hover:bg-accent transition-colors"
        >
          <p>{product.name}</p>
          <p className="text-sm text-muted-foreground">{product.price} грн</p>
        </div>
      ))}
    </div>
  );
};

/**
 * @widget SearchSheet
 * @description Адаптивний віджет для глобального пошуку.
 * - На десктопі (>= 768px) відображається як модальне вікно (Dialog).
 * - На мобільних/планшетах відображається як висувна панель зверху (Sheet).
 */
export const SearchSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const lastSearchedQueryRef = useRef<string | null>(null);

  // Функція для виконання пошуку
  const performSearch = (query: string) => {
    const trimmedQuery = query.trim();
    // Не виконувати пошук, якщо запит вже був виконаний або не змінився
    if (trimmedQuery === lastSearchedQueryRef.current) {
      return;
    }
    lastSearchedQueryRef.current = trimmedQuery;

    if (trimmedQuery) {
      startTransition(async () => {
        const foundProducts = await searchProducts(trimmedQuery);
        setProducts(foundProducts);
      });
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    // Виконуємо пошук із затримкою під час набору тексту
    performSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Скидаємо стан при закритті
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setProducts([]);
      lastSearchedQueryRef.current = null;
    }
  }, [isOpen]);

  // Обробник натискання клавіш в полі вводу
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Запобігаємо стандартній поведінці (наприклад, відправці форми)

      // Виконуємо пошук негайно
      performSearch(searchQuery);

      // На мобільних пристроях прибираємо фокус, щоб закрити клавіатуру.
      // На десктопі фокус залишається в полі вводу, щоб уникнути фокусування на діалозі.
      if (!isDesktop) {
        e.currentTarget.blur();
      }
    }
  };

  const searchInput = (
    <div className="relative">
      <Input
        placeholder="Що ви шукаєте?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-12 text-lg pr-12"
        onFocus={(e) => e.target.select()}
        onKeyDown={handleKeyDown}
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Відкрити пошук</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle>Пошук</DialogTitle>
            <DialogDescription>
              Введіть назву товару для пошуку
            </DialogDescription>
          </DialogHeader>
          {searchInput}
          <div className="mt-4 overflow-y-auto max-h-[60vh]">
            <SearchResults
              products={products}
              isLoading={isPending}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Версія для мобільних/планшетів (панель зверху) ---
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Відкрити пошук</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="h-full w-full max-w-full flex flex-col p-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-center -mt-6">
          <SheetTitle>Пошук</SheetTitle>
        </SheetHeader>
        {searchInput}
        <div className="mt-2 flex-1 overflow-y-auto">
          <SearchResults
            products={products}
            isLoading={isPending}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
