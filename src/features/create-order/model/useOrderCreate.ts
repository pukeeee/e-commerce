import { useTransition, useState } from "react";
import { toast } from "sonner";
import { createOrderAction } from "./action";
import { type CreateOrderPayload, type Order } from "@/entities/order";

// Тип для помилок валідації полів, які повертає Zod
type FieldErrors = Record<string, string[] | undefined>;

export interface UseOrderCreateState {
  fieldErrors: FieldErrors | null;
  serverError: string | null;
  /** Створене замовлення, яке повертається після успішного запиту. */
  createdOrder: Order | null;
  isSuccess: boolean;
}

interface UseOrderCreateProps {
  /** Колбек, що викликається після успішного створення замовлення. */
  onSuccess?: (order: Order) => void;
}

/**
 * Хук для керування логікою створення замовлення.
 *
 * Використовує `useTransition` для оновлення стану без блокування інтерфейсу,
 * дозволяючи відображати індикатор завантаження, поки триває асинхронна операція.
 * Це покращує користувацький досвід, не "заморожуючи" сторінку.
 */
export function useOrderCreate({ onSuccess }: UseOrderCreateProps = {}) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<UseOrderCreateState>({
    fieldErrors: null,
    serverError: null,
    createdOrder: null,
    isSuccess: false,
  });

  const createOrder = async (payload: CreateOrderPayload) => {
    // Запобігаємо повторній відправці форми, якщо запит вже виконується.
    if (isPending) {
      return;
    }

    // Загортаємо асинхронний запит у `startTransition`, щоб уникнути блокування UI.
    startTransition(async () => {
      // Скидаємо стан перед кожним новим запитом, щоб очистити старі помилки.
      setState({
        fieldErrors: null,
        serverError: null,
        createdOrder: null,
        isSuccess: false,
      });
      const toastId = toast.loading("Створюємо ваше замовлення...");

      const result = await createOrderAction(payload);

      // Обробляємо успішне створення замовлення.
      if (result.success && result.order) {
        toast.success("Замовлення успішно створено!", { id: toastId });
        setState({
          fieldErrors: null,
          serverError: null,
          createdOrder: result.order,
          isSuccess: true,
        });
        // Викликаємо колбек, щоб зовнішній код міг відреагувати на успіх.
        onSuccess?.(result.order);
      } else {
        // Обробляємо помилки, що могли виникнути під час створення замовлення.
        if ("errors" in result) {
          setState({
            fieldErrors: result.errors,
            serverError: null,
            createdOrder: null,
            isSuccess: false,
          });
          toast.error("Будь ласка, виправте помилки у формі", { id: toastId });
        } else if ("error" in result) {
          setState({
            fieldErrors: null,
            serverError: result.error.message,
            createdOrder: null,
            isSuccess: false,
          });
          toast.error(`Помилка: ${result.error.message}`, { id: toastId });
        } else {
          // Обробка непередбачуваних помилок, коли структура відповіді невідома.
          const unknownError = "Сталася невідома помилка. Спробуйте ще раз.";
          setState({
            fieldErrors: null,
            serverError: unknownError,
            createdOrder: null,
            isSuccess: false,
          });
          toast.error(unknownError, { id: toastId });
        }
      }
    });
  };

  return {
    createOrder,
    state,
    isPending,
  };
}
