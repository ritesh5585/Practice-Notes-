import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="flex items-center gap-2">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-20 rounded"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-20 rounded"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}