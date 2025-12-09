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
import React, { useState, useEffect, useTransition } from "react";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { Skeleton } from "@/shared/ui/skeleton";
import type { Product } from "@/entities/product";
import { useDebouncedCallback } from "use-debounce";
import { searchProducts } from "@/features/search-products/model/action";
import { DEBOUNCE } from "@/shared/config/constants";
import { ProductSearchCard } from "@/entities/product/ui/ProductSearchCard";

// Компонент для відображення результатів
const SearchResults = ({
  products,
  isLoading,
  onClose,
  searchQuery,
}: {
  products: Product[];
  isLoading: boolean;
  onClose: () => void;
  searchQuery: string;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (searchQuery.trim() && !isLoading && products.length === 0) {
    return (
      <div className="pb-10 text-center">
        <p className="text-lg font-medium">Нічого не знайдено</p>
        <p className="text-muted-foreground">
          Спробуйте змінити ваш пошуковий запит.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <ProductSearchCard
          key={product.id}
          product={product}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

interface SearchSheetProps {
  trigger?: React.ReactNode;
}

/**
 * @widget SearchSheet
 * @description Адаптивний віджет для глобального пошуку.
 * - На десктопі (>= 768px) відображається як модальне вікно (Dialog).
 * - На мобільних/планшетах відображається як висувна панель зверху (Sheet).
 * - Приймає необов'язковий `trigger` для гнучкості.
 */
export const SearchSheet = ({ trigger }: SearchSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebouncedCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      startTransition(async () => {
        const foundProducts = await searchProducts(trimmedQuery);
        setProducts(foundProducts);
        setIsSearching(false);
      });
    } else {
      setProducts([]);
      setIsSearching(false);
    }
  }, DEBOUNCE.DELAY);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (newValue.trim()) {
      setIsSearching(true);
    } else {
      setProducts([]);
      setIsSearching(false);
    }
    debouncedSearch(newValue);
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setProducts([]);
      debouncedSearch.cancel();
    }
  }, [isOpen, debouncedSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      debouncedSearch.flush();
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
        onChange={handleSearchChange}
        className="h-12 text-lg pr-12"
        onFocus={(e) => e.target.select()}
        onKeyDown={handleKeyDown}
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
    </div>
  );

  const defaultTrigger = (
    <Button variant="outline" size="icon">
      <Search className="h-5 w-5" />
      <span className="sr-only">Відкрити пошук</span>
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="sm:max-w-xl p-6">
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
              isLoading={isPending || isSearching}
              onClose={() => setIsOpen(false)}
              searchQuery={searchQuery}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
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
            isLoading={isPending || isSearching}
            onClose={() => setIsOpen(false)}
            searchQuery={searchQuery}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
