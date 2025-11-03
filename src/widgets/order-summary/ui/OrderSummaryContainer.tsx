"use client";

import { useOrderCreate } from "@/features/create-order/model/useOrderCreate";
import { OrderSummary } from "./OrderSummary";

export function OrderSummaryContainer() {
  const { isPending } = useOrderCreate();

  return <OrderSummary isPending={isPending} />;
}
