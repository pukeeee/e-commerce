import { useTransition, useState } from "react";
import { toast } from "sonner";
import { createOrderAction } from "./action";
import { type CreateOrderPayload } from "@/entities/order";

// Тип для помилок валідації полів, які повертає Zod
type FieldErrors = Record<string, string[] | undefined>;

interface UseOrderCreateState {
  fieldErrors: FieldErrors | null;
  serverError: string | null;
}

/**
 * Хук для керування логікою створення замовлення.
 * Використовує useTransition для асинхронних операцій без блокування UI.
 */
export function useOrderCreate() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<UseOrderCreateState>({
    fieldErrors: null,
    serverError: null,
  });

  const createOrder = async (payload: CreateOrderPayload) => {
    // Починаємо транзакцію (асинхронну операцію)
    startTransition(async () => {
      // Скидаємо попередні помилки
      setState({ fieldErrors: null, serverError: null });
      toast.loading("Створюємо ваше замовлення...");

      const result = await createOrderAction(payload);

      if (result.success) {
        toast.success("Замовлення успішно створено!");
        // Тут в майбутньому можна додати очищення кошика, редірект тощо.
      } else {
        // Обробка помилок
        if ("errors" in result) {
          setState({ fieldErrors: result.errors, serverError: null });
          toast.error("Будь ласка, виправте помилки у формі");
        } else if ("error" in result) {
          setState({ fieldErrors: null, serverError: result.error.message });
          toast.error(`Помилка: ${result.error.message}`);
        } else {
          // Запасний варіант на випадок невідомої структури помилки
          const unknownError = "Сталася невідома помилка. Спробуйте ще раз.";
          setState({ fieldErrors: null, serverError: unknownError });
          toast.error(unknownError);
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
