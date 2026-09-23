'use client';
import { Navbar } from '@/components/storefront/Navbar';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { useApp } from '@/context/AppContext';

export default function ShopPage() {
  const { products, loading } = useApp();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-serif font-bold text-amber-200 text-center mb-8">All Fragrances Catalog</h1>
        <ProductGrid products={products} isLoading={loading} />
      </main>
    </div>
  );
}
