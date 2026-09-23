'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/storefront/Navbar';
import { Hero } from '@/components/storefront/Hero';
import { CategoryTabs } from '@/components/storefront/CategoryTabs';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { FragranceCategory } from '@/types';

export default function CatalogPage() {
  const { products, loading, refreshProducts } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'bestsellers' | 'discounts'>('general');
  const [selectedCategory, setSelectedCategory] = useState<FragranceCategory | 'all'>('all');

  // Refresh products automatically when the catalog page mounts or gains focus
  useEffect(() => {
    refreshProducts();
    
    const handleFocus = () => {
      refreshProducts();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshProducts]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    let matchesTab = true;
    if (activeTab === 'bestsellers') {
      matchesTab = product.is_featured === true || product.is_best_seller === true;
    } else if (activeTab === 'discounts') {
      matchesTab =
        product.discount_price !== undefined &&
        product.discount_price !== null &&
        product.discount_price < product.price;
    }

    return matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />
      <Hero />

      <main id="catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex justify-center border-b border-zinc-800/80 pb-6">
          <CategoryTabs 
            activeTab={activeTab}
            onTabChange={(tab: 'general' | 'bestsellers' | 'discounts') => setActiveTab(tab)}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat: FragranceCategory | 'all') => setSelectedCategory(cat)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>
    </div>
  );
}