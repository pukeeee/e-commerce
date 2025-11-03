"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import React, { useEffect } from "react";

import { useCart, type CartItem } from "@/entities/cart"; // ✅ Імпортуємо тип CartItem
import {
  CreateOrderPayloadSchema,
  PaymentMethodEnum,
  PaymentMethodLabels,
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
import { PhoneInput } from "@/shared/ui/PhoneInput";

type OrderFormValues = z.infer<typeof CreateOrderPayloadSchema>;

export function OrderForm() {
  // ✅ Правильно отримуємо потрібні частини стану
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clear);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(CreateOrderPayloadSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      orderNote: "",
      paymentMethod: "cash_on_delivery",
      items: [],
      totalAmount: 0,
    },
  });

  // ✅ Деструктуруємо стабільні методи, щоб безпечно їх використовувати в залежностях
  const { reset, setError, setValue } = form;

  const { createOrder, isPending, state } = useOrderCreate({
    onSuccess: () => {
      clearCart();
    },
  });

  // ✅ Правильний useEffect для синхронізації кошика з формою
  useEffect(() => {
    const orderItems = Object.values(items).map((item: CartItem) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const newTotalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    setValue("items", orderItems);
    setValue("totalAmount", newTotalAmount);
  }, [items, setValue]); // ✅ Правильні та стабільні залежності

  // ✅ useEffect для помилок сервера з виправленими залежностями
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
  }, [state.fieldErrors, setError]); // ✅ Правильні та стабільні залежності

  // ✅ Ефект для очищення форми після успішного замовлення
  useEffect(() => {
    if (state.isSuccess) {
      reset();
    }
  }, [state.isSuccess, reset]);

  // ✅ Функція onSubmit тепер чиста - вона просто відправляє дані
  async function onSubmit(data: OrderFormValues) {
    await createOrder(data);
  }

  return (
    <Form {...form}>
      <form
        id="order-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {state.serverError && <ErrorMessage message={state.serverError} />}

        {/* ...решта полів форми без змін... */}
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
  );
}
