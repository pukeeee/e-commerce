"use client";

import { useState } from "react";
import { useCart } from "@/entities/cart";
import type { Order } from "@/entities/order";
import { useOrderCreate } from "@/features/create-order/model/useOrderCreate";
import { OrderForm } from "@/features/create-order/ui/OrderForm";
import { OrderSummaryContainer } from "@/widgets/order-summary";
import { OrderSuccessView } from "@/widgets/order-success/ui/OrderSuccess";

export default function CheckoutPage() {
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const clearCart = useCart((state) => state.clear);

  // Хук викликається тут!
  const { createOrder, isPending, state } = useOrderCreate({
    onSuccess: (order) => {
      setCreatedOrder(order); // Встановлюємо стан для показу екрану успіху
      clearCart(); // Очищуємо кошик
    },
  });

  // Якщо замовлення створено, показуємо екран успіху
  if (createdOrder) {
    return <OrderSuccessView order={createdOrder} />;
  }

  return (
    <main className="container mx-auto max-w-5xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Оформлення замовлення</h1>
        <p className="text-muted-foreground">
          Заповніть форму нижче, щоб завершити покупку.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        {/* Ліва колонка: Форма замовлення */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Ваші дані</h2>
          <OrderForm
            createOrder={createOrder}
            state={state}
            isPending={isPending}
          />
        </div>

        {/* Права колонка: Склад замовлення */}
        <div className="min-w-0 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-semibold">Ваше замовлення</h2>
          <OrderSummaryContainer isPending={isPending} />
        </div>
      </div>
    </main>
  );
}
