import { OrderForm } from "@/features/create-order/ui/OrderForm";
import { OrderSummaryContainer } from "@/widgets/order-summary";

export default function CheckoutPage() {
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
          <OrderForm />
        </div>

        {/* Права колонка: Склад замовлення */}
        <div className="min-w-0 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-semibold">Ваше замовлення</h2>
          <OrderSummaryContainer />
        </div>
      </div>
    </main>
  );
}
