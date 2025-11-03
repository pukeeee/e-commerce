"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
import { useDebounce } from "@/shared/hooks/use-debounce";

interface FilterPanelProps {
  currentFilters: ProductFilters;
}

export function FilterPanel({ currentFilters }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentFilters.search || "");
  const [minPrice, setMinPrice] = useState(
    currentFilters.minPrice?.toString() || "",
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.maxPrice?.toString() || "",
  );

  // 4. Правильно використовуємо debounce
  const debouncedSearch = useDebounce(search, 500);

  const updateFilters = useCallback(
    (updates: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname], // 3. Вказуємо її залежності
  );

  useEffect(() => {
    if (debouncedSearch !== (currentFilters.search || "")) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, currentFilters.search, updateFilters]);

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      {/* Пошук */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Пошук товарів..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
            onBlur={() =>
              updateFilters({
                minPrice: minPrice ? Number(minPrice) : undefined,
              })
            }
          />
        </div>
        <div className="w-32">
          <label className="text-sm text-muted-foreground mb-1 block">до</label>
          <Input
            type="number"
            placeholder="∞"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() =>
              updateFilters({
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
              })
            }
          />
        </div>
      </div>

      {/* Сортування */}
      <Select
        value={currentFilters.sort}
        onValueChange={(value) => updateFilters({ sort: value as SortOption })}
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
      {(search || minPrice || maxPrice || currentFilters.sort !== "newest") && (
        <Button variant="outline" onClick={() => router.push(pathname)}>
          Скинути фільтри
        </Button>
      )}
    </div>
  );
}
