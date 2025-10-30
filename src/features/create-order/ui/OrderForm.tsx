"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import React, { useEffect } from "react";

import { useCart } from "@/entities/cart";
import {
  CreateOrderPayloadSchema,
  PaymentMethodEnum,
  PaymentMethodLabels,
  type CreateOrderPayload,
} from "@/entities/order";
import { useOrderCreate } from "../model/useOrderCreate";

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

// Виводимо тип на основі схеми Zod
type OrderFormValues = z.infer<typeof CreateOrderPayloadSchema>;

export function OrderForm() {
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clear);
  // Цей хук з check.md ми поки не чіпаємо, він працює як треба
  const { createOrder, isPending, state } = useOrderCreate();

  // 1. Ініціалізуємо форму за допомогою react-hook-form
  const form = useForm<OrderFormValues>({
    // 2. Підключаємо валідатор Zod
    resolver: zodResolver(CreateOrderPayloadSchema),
    // 3. Встановлюємо значення за замовчуванням
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      orderNote: "",
      paymentMethod: "cash_on_delivery",
      // Ці поля не є частиною форми, але потрібні для схеми
      items: [],
      totalAmount: 0,
    },
  });

  useEffect(() => {
    if (state.fieldErrors) {
      for (const [fieldName, errors] of Object.entries(state.fieldErrors)) {
        if (errors && errors.length > 0) {
          form.setError(fieldName as keyof OrderFormValues, {
            type: "server",
            message: errors.join(", "),
          });
        }
      }
    }
  }, [state.fieldErrors, form]);

  // 4. Функція, що викликається при успішній валідації
  async function onSubmit(data: OrderFormValues) {
    const orderItems = Object.values(items).map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Створюємо повний payload
    const payload: CreateOrderPayload = {
      ...data,
      items: orderItems,
      totalAmount,
    };

    // Викликаємо server action з даними з форми та кошика
    await createOrder(payload);

    // Логіка очищення кошика залишається
    if (!state.serverError && !state.fieldErrors) {
      // Можливо, варто перевіряти на успіх, а не на відсутність помилок
      clearCart();
    }
  }

  return (
    // 5. Обгортаємо все в компонент Form від shadcn
    <Form {...form}>
      <form
        id="order-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {state.serverError && <ErrorMessage message={state.serverError} />}

        {/* Кожне поле тепер обгорнуте в FormField */}
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
                <Input
                  placeholder="+380991234567"
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
  );
}
