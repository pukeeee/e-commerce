import { Skeleton } from "@/shared/ui/skeleton";

export const WishlistItemSkeleton = () => {
  return (
    <div className="flex items-start gap-4 py-4">
      <Skeleton className="h-20 w-20 rounded-md" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="mt-2">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  );
};
