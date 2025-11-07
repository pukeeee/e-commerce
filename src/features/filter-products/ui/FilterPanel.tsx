"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  SORT_OPTIONS,
  type ProductFilters,
  type SortOption,
} from "@/entities/product/model/filter-types";

interface FilterPanelProps {
  currentFilters: ProductFilters;
}

export function FilterPanel({ currentFilters }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state
  const [minPrice, setMinPrice] = useState(
    currentFilters.minPrice?.toString() || "",
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.maxPrice?.toString() || "",
  );

  // ✅ Мемоїзована функція оновлення
  const updateFilters = useCallback(
    (updates: Partial<Omit<ProductFilters, "search">>) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === "" || value === null) {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        });

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router, pathname],
  );

  // ✅ Мемоїзована перевірка наявності активних фільтрів
  const hasActiveFilters = useMemo(() => {
    return !!(minPrice || maxPrice || currentFilters.sort !== "newest");
  }, [minPrice, maxPrice, currentFilters.sort]);

  // ✅ Обробник для скидання з transition, що зберігає інші параметри (напр. глобальний пошук)
  const handleReset = useCallback(() => {
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("minPrice");
      params.delete("maxPrice");
      params.delete("sort");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      {/* Фільтр за ціною */}
      <div className="flex gap-2 items-end">
        <div className="w-32">
          <label className="text-sm text-muted-foreground mb-1 block">
            Ціна від
          </label>
          <Input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => {
              const value = minPrice ? Number(minPrice) : undefined;
              if (value !== currentFilters.minPrice) {
                updateFilters({ minPrice: value });
              }
            }}
            disabled={isPending}
          />
        </div>

        <div className="w-32">
          <label className="text-sm text-muted-foreground mb-1 block">до</label>
          <Input
            type="number"
            placeholder="∞"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => {
              const value = maxPrice ? Number(maxPrice) : undefined;
              if (value !== currentFilters.maxPrice) {
                updateFilters({ maxPrice: value });
              }
            }}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Сортування */}
      <Select
        value={currentFilters.sort}
        onValueChange={(value) => updateFilters({ sort: value as SortOption })}
        disabled={isPending}
      >
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Кнопка скидання */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={handleReset} disabled={isPending}>
          Скинути фільтри
        </Button>
      )}
    </div>
  );
}
