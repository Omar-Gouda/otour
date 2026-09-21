import React from 'react';
import { Product } from '@/types';
import { ProductCard } from '../ui/ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl my-8">
        <p className="text-zinc-400 text-base">No luxury fragrances found matching your selection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};