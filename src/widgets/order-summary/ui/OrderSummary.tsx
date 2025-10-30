"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/entities/cart";
import { calculateCartTotals } from "@/entities/cart/lib/calculations";
import { CartItemsList } from "@/widgets/cart-sheet/ui/CartItemsList";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { formatPrice } from "@/shared/lib/utils";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      form="order-form" // Зв'язуємо кнопку з формою
      className="w-full"
      disabled={pending}
    >
      {pending ? "Обробка..." : "Оформити замовлення"}
    </Button>
  );
}

export function OrderSummary() {
  const items = useCart((state) => state.items);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  const totals = useMemo(
    () => calculateCartTotals(items, appliedPromo),
    [items, appliedPromo],
  );

  const handleApplyPromoCode = () => {
    setAppliedPromo(promoCode);
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo("");
    setPromoCode(""); // Очищуємо і поле вводу
  };

  return (
    <div className="flex flex-col">
      <div className="max-h-[400px] overflow-y-auto pr-2">
        <CartItemsList />
      </div>
      <div className="mt-6 space-y-4 border-t pt-6">
        <p className="text-lg font-medium">Підсумок</p>

        {/* Промокод */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Промокод"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={!!appliedPromo}
          />
          {appliedPromo ? (
            <Button
              onClick={handleRemovePromoCode}
              variant="outline"
              type="button"
            >
              Скасувати
            </Button>
          ) : (
            <Button
              onClick={handleApplyPromoCode}
              disabled={!promoCode}
              variant="outline"
              type="button"
            >
              Застосувати
            </Button>
          )}
        </div>

        {/* Розрахунки */}
        <div className="space-y-2 text-sm">
          {totals.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="text-muted-foreground">
                Знижка ({appliedPromo})
              </span>
              <span>-{formatPrice(totals.discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-base font-semibold">
            <span>Разом до сплати</span>
            <span>{formatPrice(totals.total)}</span>
          </div>
        </div>

        <div className="mt-6">
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}
