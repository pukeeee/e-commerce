"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Product } from "@/entities/product";
import { formatPrice } from "@/shared/lib/utils";
import { AddToCartButton } from "@/features/add-to-cart";
import { Badge } from "@/shared/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import {
  Smartphone,
  Cpu,
  Battery,
  Camera,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { SectionHeading } from "@/shared/ui/section-heading";

interface ProductDetailViewProps {
  product: Product;
}

// Тимчасові дані для характеристик (поки немає в БД)
// TODO: Перенести в окрему модель після додавання в БД
const getMockSpecifications = (productName: string) => {
  // Визначаємо тип товару по назві (тимчасово)
  const isPhone = productName.toLowerCase().includes("iphone");
  const isMac = productName.toLowerCase().includes("mac");
  const isWatch = productName.toLowerCase().includes("watch");
  const isAirPods = productName.toLowerCase().includes("airpods");

  if (isPhone) {
    return [
      { icon: Smartphone, label: "Дисплей", value: '6.1" Super Retina XDR' },
      { icon: Cpu, label: "Процесор", value: "A16 Bionic" },
      {
        icon: Camera,
        label: "Камера",
        value: "48 MP основна + 12 MP фронтальна",
      },
      { icon: Battery, label: "Батарея", value: "До 20 годин відео" },
      { icon: Shield, label: "Захист", value: "IP68, Ceramic Shield" },
      { icon: Zap, label: "Зарядка", value: "MagSafe, USB-C" },
    ];
  }

  if (isMac) {
    return [
      { icon: Smartphone, label: "Дисплей", value: 'Retina 5K 27"' },
      { icon: Cpu, label: "Процесор", value: "Apple M3 Pro" },
      { icon: Battery, label: "Пам'ять", value: "16 ГБ уніфікованої пам'яті" },
      { icon: Shield, label: "Накопичувач", value: "512 ГБ SSD" },
      { icon: Zap, label: "Графіка", value: "Apple GPU (10 ядер)" },
    ];
  }

  if (isWatch) {
    return [
      {
        icon: Smartphone,
        label: "Дисплей",
        value: "Always-On Retina LTPO OLED",
      },
      { icon: Battery, label: "Батарея", value: "До 18 годин" },
      { icon: Shield, label: "Захист", value: "WR50, сапфірове скло" },
      { icon: Zap, label: "Датчики", value: "ЕКГ, SpO2, температура" },
    ];
  }

  if (isAirPods) {
    return [
      { icon: Battery, label: "Батарея", value: "До 6 годин прослуховування" },
      { icon: Zap, label: "Чіп", value: "Apple H2" },
      { icon: Shield, label: "Функції", value: "Активне шумозаглушення" },
    ];
  }

  // Загальні характеристики за замовчуванням
  return [
    { icon: Shield, label: "Гарантія", value: "Офіційна 1 рік" },
    { icon: CheckCircle2, label: "Наявність", value: "В наявності" },
  ];
};

// Тимчасові переваги (поки немає в БД)
const getMockFeatures = (productName: string) => {
  const isPhone = productName.toLowerCase().includes("iphone");

  if (isPhone) {
    return [
      "Найновіша камерна система для неймовірних фото",
      "Найшвидший чіп у смартфоні",
      "Вражаюча витривалість батареї",
      "Міцний дизайн з Ceramic Shield",
      "Dynamic Island для інтуїтивної взаємодії",
      "iOS 18 з передовими функціями ШІ",
    ];
  }

  return [
    "Преміальна якість та надійність",
    "Офіційна гарантія від Apple",
    "Швидка доставка по всій Україні",
    "Консультація спеціалістів",
  ];
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const specifications = getMockSpecifications(product.name);
  const features = getMockFeatures(product.name);
  const imageUrl = product.imageUrl || "/images/placeholder.svg";

  // Стиль для оптимізації анімації (уникаємо артефактів)
  const animationStyle = { backfaceVisibility: "hidden" as const };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Ліва колонка - Зображення (виправлено проблему з sticky) */}
      <div className="relative">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/30 border shadow-lg"
            style={animationStyle}
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              priority
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              // Додано стиль для GPU-прискорення
              style={{ transform: "translateZ(0)" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Права колонка - Інформація */}
      <div className="space-y-6">
        {/* Назва та ціна */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="space-y-4"
          style={animationStyle}
        >
          <div>
            <Badge variant="secondary" className="mb-3">
              Новинка
            </Badge>
            <SectionHeading className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {product.name}
            </SectionHeading>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="text-4xl sm:text-5xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            {/* TODO: Додати стару ціну якщо є знижка */}
          </div>
        </motion.div>

        {/* Короткий опис */}
        {product.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
            style={animationStyle}
          >
            {product.description}
          </motion.p>
        )}

        {/* Кнопка додавання в кошик */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          style={animationStyle}
        >
          <AddToCartButton product={product} />
        </motion.div>

        {/* Основні характеристики */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className="space-y-3"
          style={animationStyle}
        >
          <h2 className="text-xl font-semibold">Основні характеристики</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specifications.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border"
                >
                  <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {spec.label}
                    </p>
                    <p className="text-sm font-semibold">{spec.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Переваги */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          className="space-y-3"
          style={animationStyle}
        >
          <h2 className="text-xl font-semibold">Чому варто купити</h2>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Детальна інформація в акордеоні */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          style={animationStyle}
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Детальний опис</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    {product.description ||
                      "Детальний опис товару буде додано найближчим часом."}
                  </p>
                  {/* TODO: Додати детальний опис з БД */}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specs">
              <AccordionTrigger>Повні характеристики</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {specifications.map((spec, index) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {spec.label}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {spec.value}
                        </span>
                      </div>
                    );
                  })}
                  {/* TODO: Додати повні характеристики з БД */}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger>Доставка та оплата</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Доставка:</strong> Нова Пошта по всій Україні.
                    Безкоштовна доставка при замовленні від 2000 грн.
                  </p>
                  <p>
                    <strong>Оплата:</strong> Готівкою при отриманні або онлайн
                    оплата карткою.
                  </p>
                  <p>
                    <strong>Гарантія:</strong> Офіційна гарантія від виробника 1
                    рік.
                  </p>
                  {/* TODO: Додати реальну інформацію про доставку */}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
