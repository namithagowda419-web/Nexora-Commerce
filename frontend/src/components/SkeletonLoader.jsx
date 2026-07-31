import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-darkbg-card rounded-3xl p-4 border border-lilac-soft dark:border-darkbg-border animate-pulse flex flex-col gap-3">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mt-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
      <div className="flex justify-between items-center mt-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
