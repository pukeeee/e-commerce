/**
 * Форматує номер телефону в процесі введення
 * @example "+380 99 123 45 67"
 */
export function formatPhoneNumber(value: string): string {
  if (!value) return "";

  const startsWithPlus = value.startsWith("+");
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return startsWithPlus ? "+" : "";
  }

  // Покращена логіка нормалізації
  let normalizedDigits;
  const firstDigit = digits.charAt(0);

  if (firstDigit === "3") {
    // Користувач, ймовірно, вводить міжнародний формат, починаючи з '3'
    normalizedDigits = digits;
  } else if (firstDigit === "0") {
    // Користувач вводить національний формат
    normalizedDigits = "38" + digits;
  } else {
    // Користувач вводить код оператора напряму
    normalizedDigits = "380" + digits;
  }

  // Логіка форматування
  const len = normalizedDigits.length;

  // Обробка неповного коду країни
  if (len < 3) {
    return `+${normalizedDigits}`; // Поверне +3, +38
  }

  // Обрізаємо до 12 цифр (380 + 9)
  const fullNumber = normalizedDigits.substring(0, 12);
  const numberPart = fullNumber.substring(3);
  let result = "+380";

  if (numberPart.length > 0) {
    result += ` (${numberPart.substring(0, 2)}`;
  }
  if (numberPart.length > 2) {
    result += `) ${numberPart.substring(2, 5)}`;
  }
  if (numberPart.length > 5) {
    result += `-${numberPart.substring(5, 7)}`;
  }
  if (numberPart.length > 7) {
    result += `-${numberPart.substring(7, 9)}`;
  }

  return result;
}

/**
 * Нормалізує телефон для відправки на сервер
 * @example "+380991234567"
 */
export function normalizePhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("380") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+38${digits}`;
  }
  // Якщо номер введено без коду країни (9 цифр)
  if (digits.length === 9) {
    return `+380${digits}`;
  }
  return `+${digits}`; // Fallback
}
