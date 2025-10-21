import React from "react";

/**
 * @component OrderView
 * @description Компонент для відображення деталей одного замовлення.
 */
export const OrderView = ({ orderId }: { orderId: string }) => {
  return (
    <div>
      <h2>Деталі замовлення #{orderId}</h2>
      {/* Тут буде логіка завантаження та відображення даних про замовлення */}
      <p>Інформація про замовлення буде тут.</p>
    </div>
  );
};
