"use client";

import { OrderSummary } from "./OrderSummary";

interface OrderSummaryContainerProps {
  isPending: boolean;
}

export function OrderSummaryContainer({
  isPending,
}: OrderSummaryContainerProps) {
  return <OrderSummary isPending={isPending} />;
}
