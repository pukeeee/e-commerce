import { useTransition, useState } from "react";
import { toast } from "sonner";
import { createOrderAction } from "./action";
import { type CreateOrderPayload, type Order } from "@/entities/order";

// Тип для помилок валідації полів, які повертає Zod
type FieldErrors = Record<string, string[] | undefined>;

interface UseOrderCreateState {
  fieldErrors: FieldErrors | null;
  serverError: string | null;
  createdOrder: Order | null; // Зберігаємо створене замовлення
  isSuccess: boolean;
}

interface UseOrderCreateProps {
  onSuccess?: (order: Order) => void; // Колбек отримує замовлення
}

/**
 * Хук для керування логікою створення замовлення.
 * Використовує useTransition для асинхронних операцій без блокування UI.
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
    // Починаємо транзакцію (асинхронну операцію)
    startTransition(async () => {
      // Скидаємо попередні помилки та результат
      setState({
        fieldErrors: null,
        serverError: null,
        createdOrder: null,
        isSuccess: false,
      });
      const toastId = toast.loading("Створюємо ваше замовлення...");

      const result = await createOrderAction(payload);

      // ✅ Додано перевірку на існування result.order
      if (result.success && result.order) {
        toast.success("Замовлення успішно створено!", { id: toastId });
        setState({
          fieldErrors: null,
          serverError: null,
          createdOrder: result.order,
          isSuccess: true,
        });
        onSuccess?.(result.order); // Тепер тут безпечно
      } else {
        // Обробка помилок
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
          // Запасний варіант (включаючи випадок success: true, але без order)
          const unknownError =
            "Сталася невідома помилка. Спробуйте ще раз.";
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
