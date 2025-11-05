"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
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

  const [minPrice, setMinPrice] = useState(
    currentFilters.minPrice?.toString() || "",
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.maxPrice?.toString() || "",
  );

  const updateFilters = useCallback(
    (updates: Partial<Omit<ProductFilters, "search">>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      // Скидаємо пошук, якщо він був у параметрах, але тепер керується з іншого місця
      params.delete("search");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

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
      {(minPrice || maxPrice || currentFilters.sort !== "newest") && (
        <Button variant="outline" onClick={() => router.push(pathname)}>
          Скинути фільтри
        </Button>
      )}
    </div>
  );
}
