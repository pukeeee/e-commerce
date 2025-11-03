"use client";

import { forwardRef } from "react";
import { Input } from "@/shared/ui/input";
import { formatPhoneNumber } from "@/shared/lib/formatters";

export const PhoneInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ onChange, value, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);

    // Создаем синтетическое событие с отформатированным значением
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted,
      },
    };

    onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Input
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="+380 99 123 45 67"
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";
