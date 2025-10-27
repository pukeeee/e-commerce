import { AppError } from "./app-error";

/**
 * Централізований обробник помилок для Server Actions.
 * Він перехоплює помилки, логує їх (у майбутньому - в Sentry/DataDog)
 * та повертає стандартизований об'єкт помилки для клієнта.
 */
export function handleServerError(error: unknown) {
  if (error instanceof AppError) {
    return {
      // Очікувана помилка, яку ми самі згенерували
      success: false as const,
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      },
    };
  }

  // Непередбачувана, системна помилка
  // TODO: Інтегрувати сервіс логування (Sentry, DataDog, etc.)
  console.error("Unexpected server error:", error);

  return {
    success: false as const,
    error: {
      code: "INTERNAL_ERROR",
      message: "Внутрішня помилка сервера. Спробуйте, будь ласка, пізніше.",
      statusCode: 500,
    },
  };
}
