"use client";

import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isPending: boolean;
}

export function SubmitButton({ isPending }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      form="order-form"
      className="w-full"
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Обробка...
        </>
      ) : (
        "Оформити замовлення"
      )}
    </Button>
  );
}
