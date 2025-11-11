"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import React, { useEffect, useMemo } from "react";

import { useCartItems } from "@/entities/cart";
import {
  CreateOrderPayloadSchema,
  PaymentMethodEnum,
  PaymentMethodLabels,
  type CreateOrderPayload,
} from "@/entities/order";
import type { UseOrderCreateState } from "../model/useOrderCreate";

import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { ErrorMessage } from "@/shared/ui/error-message";
import { PhoneInput } from "@/shared/ui/PhoneInput";
import { LoadingOverlay } from "@/shared/ui/loading-overlay";

type OrderFormValues = z.infer<typeof CreateOrderPayloadSchema>;

interface OrderFormProps {
  isPending: boolean;
  state: UseOrderCreateState;
  createOrder: (payload: CreateOrderPayload) => Promise<void>;
}

export function OrderForm({ isPending, state, createOrder }: OrderFormProps) {
  const items = useCartItems();

  const { orderItems, totalAmount, itemCount } = useMemo(() => {
    const itemsArray = Object.values(items);
    const orderItems = itemsArray.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return { orderItems, totalAmount, itemCount: itemsArray.length };
  }, [items]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(CreateOrderPayloadSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      orderNote: "",
      paymentMethod: "cash_on_delivery",
      items: orderItems, // Початкові значення з useMemo
      totalAmount: totalAmount, // Початкові значення з useMemo
    },
  });

  const { setError, setValue } = form;

  useEffect(() => {
    if (state.fieldErrors) {
      for (const [fieldName, errors] of Object.entries(state.fieldErrors)) {
        if (errors && errors.length > 0) {
          setError(fieldName as keyof OrderFormValues, {
            type: "server",
            message: errors.join(", "),
          });
        }
      }
    }
  }, [state.fieldErrors, setError]);

  // Синхронізація форми з даними кошика
  useEffect(() => {
    setValue("items", orderItems);
    setValue("totalAmount", totalAmount);
  }, [orderItems, totalAmount, setValue]);

  // Якщо кошик порожній, показуємо відповідне повідомлення
  if (itemCount === 0 && !isPending) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Ваш кошик порожній</h3>
        <p className="mt-2 text-muted-foreground">
          Додайте товари, щоб продовжити оформлення замовлення.
        </p>
      </div>
    );
  }

  async function onSubmit(data: OrderFormValues) {
    // Дані вже синхронізовані, просто викликаємо екшен
    await createOrder(data);
  }

  return (
    <div className="relative">
      <LoadingOverlay isLoading={isPending} message="Створюємо замовлення..." />
      <Form {...form}>
        <form
          id="order-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {state.serverError && (
            <ErrorMessage
              title="Помилка сервера"
              message={state.serverError}
              type="error"
            />
          )}

          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Імя
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Тарас Шевченко"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="kobzar@gmail.com"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Телефон <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <PhoneInput {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Адреса доставки <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="м. Київ, вул. Хрещатик, 24, кв. 12"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Спосіб оплати <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                    disabled={isPending}
                  >
                    {PaymentMethodEnum.options.map((method) => (
                      <FormItem
                        key={method}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={method} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {PaymentMethodLabels[method]}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Коментар до замовлення</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Додаткові побажання, код від під'їзду тощо."
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
