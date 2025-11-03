"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { formatPrice } from "@/shared/lib/utils";
import type { Order } from "@/entities/order";
import { PaymentMethodLabels } from "@/entities/order";

interface OrderSuccessViewProps {
  order: Order;
}

export function OrderSuccessView({ order }: OrderSuccessViewProps) {
  return (
    <main className="container mx-auto max-w-2xl py-16 px-4">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 mb-6" />

        <h1 className="text-3xl font-bold mb-2">Замовлення оформлено!</h1>

        <p className="text-muted-foreground mb-8">
          Дякуємо за покупку. Ми надіслали підтвердження на{" "}
          <span className="font-medium">{order.customerEmail}</span>
        </p>

        <div className="bg-card border rounded-lg p-6 text-left mb-8">
          <h2 className="font-semibold mb-4">Деталі замовлення</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Номер замовлення:</span>
              <span className="font-mono">#{order.id.slice(0, 8)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Спосіб оплати:</span>
              <span>{PaymentMethodLabels[order.paymentMethod]}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Адреса доставки:</span>
              <span className="text-right max-w-xs">
                {order.shippingAddress}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-base">
              <span>Сума замовлення:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/">Повернутися до покупок</Link>
          </Button>

          <Button asChild>
            <Link href={`/orders/`}>Переглянути замовлення</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
