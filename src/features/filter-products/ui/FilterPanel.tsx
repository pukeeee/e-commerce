"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  useState,
  useTransition,
  useCallback,
  useMemo,
  useEffect,
} from "react";
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
import type { KeyboardEvent } from "react";

interface FilterPanelProps {
  currentFilters: ProductFilters;
}

/**
 * @feature FilterPanel
 * @description
 * Клієнтський компонент, що надає користувачам інтерфейс для сортування та фільтрації товарів.
 * Керує станом фільтрів, оновлює URL-параметри та взаємодіє з користувачем.
 *
 * @param currentFilters - Поточні активні фільтри, отримані з URL.
 */
export function FilterPanel({ currentFilters }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Локальний стан для полів вводу, щоб не оновлювати URL на кожне натискання клавіші.
  const [minPrice, setMinPrice] = useState(
    currentFilters.minPrice?.toString() || "",
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.maxPrice?.toString() || "",
  );

  /**
   * Синхронізує локальний стан інпутів з параметрами URL.
   * Це потрібно, щоб поля оновлювалися при навігації (напр. кнопки "назад"/"вперед" у браузері).
   */
  useEffect(() => {
    setMinPrice(currentFilters.minPrice?.toString() || "");
    setMaxPrice(currentFilters.maxPrice?.toString() || "");
  }, [currentFilters.minPrice, currentFilters.maxPrice]);

  /**
   * Мемоїзована функція для оновлення параметрів пошуку в URL.
   * Використовує `startTransition` для уникнення блокування UI під час оновлення.
   */
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

  /**
   * Визначає, чи є активні фільтри (крім сортування),
   * щоб показати або приховати кнопку "Скинути фільтри".
   * Логіка базується на `currentFilters` з URL, а не на локальному стані інпутів.
   */
  const hasActiveFilters = useMemo(() => {
    return (
      currentFilters.minPrice !== undefined ||
      currentFilters.maxPrice !== undefined
    );
  }, [currentFilters.minPrice, currentFilters.maxPrice]);

  /**
   * Скидає фільтри ціни, але зберігає поточне сортування.
   * Очищує локальний стан та відповідні параметри в URL.
   */
  const handleReset = useCallback(() => {
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("minPrice");
      params.delete("maxPrice");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  // Функції для застосування фільтрів при втраті фокусу або натисканні Enter.
  const applyMinPrice = () => {
    const value = minPrice ? Number(minPrice) : undefined;
    if (value !== currentFilters.minPrice) {
      updateFilters({ minPrice: value });
    }
  };

  const applyMaxPrice = () => {
    const value = maxPrice ? Number(maxPrice) : undefined;
    if (value !== currentFilters.maxPrice) {
      updateFilters({ maxPrice: value });
    }
  };

  // Обробники натискання клавіші "Enter" для полів вводу ціни.
  const handleMinPriceKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyMinPrice();
    }
  };

  const handleMaxPriceKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyMaxPrice();
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Блок з основними елементами керування: сортування та фільтри */}
      <div className="flex flex-col gap-4">
        {/* Секція сортування */}
        <div>
          <label className="text-sm font-medium mb-2 block">Сортування</label>
          <Select
            value={currentFilters.sort}
            onValueChange={(value) =>
              updateFilters({ sort: value as SortOption })
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-full">
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
        </div>

        {/* Секція фільтрації за ціною */}
        <div>
          <label className="text-sm font-medium mb-2 block">Ціна</label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Від"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={applyMinPrice}
              onKeyDown={handleMinPriceKeyDown}
              disabled={isPending}
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="До"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={applyMaxPrice}
              onKeyDown={handleMaxPriceKeyDown}
              disabled={isPending}
            />
          </div>
        </div>
        {/* Майбутні фільтри можна додавати тут */}
      </div>

      {/* Блок з кнопкою скидання, що "прилипає" до низу контейнера */}
      <div className="mt-auto">
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isPending}
            className="w-full"
          >
            Скинути фільтри
          </Button>
        )}
      </div>
    </div>
  );
}
