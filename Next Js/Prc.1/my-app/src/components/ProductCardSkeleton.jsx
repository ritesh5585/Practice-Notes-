import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      <CardHeader className="space-y-2">
        {/* Category Badge Skeleton */}
        <Skeleton className="h-5 w-24 rounded-full" />

        {/* Title Skeleton - 2 lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Rating Skeleton */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
          <Skeleton className="h-3 w-8 ml-1" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Description Skeleton - 2 lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mt-1" />
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        {/* Price Skeleton */}
        <Skeleton className="h-7 w-20" />
        {/* Button Skeleton */}
        <Skeleton className="h-9 w-28 rounded-lg" />
      </CardFooter>
    </Card>
  );
}
