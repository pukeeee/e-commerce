import { cn } from "@/shared/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Базовый компонент skeleton с анимацией
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

/**
 * Skeleton для кнопки
 */
export function ButtonSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-full", className)} />;
}
