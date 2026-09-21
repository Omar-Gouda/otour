'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { CategoryTabs } from '@/components/storefront/CategoryTabs';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { Footer } from '@/components/storefront/Footer';
import { getProducts } from '@/services/products.service';
import { Product, FragranceCategory } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'general' | 'bestsellers' | 'discounts'>('general');
  const [selectedCategory, setSelectedCategory] = useState<FragranceCategory | 'all'>('all');

  const hasTrackedRef = useRef(false);

  // Track UNIQUE client visits only
  useEffect(() => {
    const trackUniqueVisit = async () => {
      if (hasTrackedRef.current) return;
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return;

      const hasVisitedSession = sessionStorage.getItem('aura_luxe_visited');

      if (!hasVisitedSession) {
        hasTrackedRef.current = true;
        sessionStorage.setItem('aura_luxe_visited', 'true');

        try {
          const supabase = createClient();
          await supabase.from('site_visits').insert([{}]);
        } catch (err) {
          console.error('Error tracking visit:', err);
        }
      }
    };

    trackUniqueVisit();
  }, []);

  // Fetch filtered catalog products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const filters: Parameters<typeof getProducts>[0] = {};
      if (activeTab === 'bestsellers') filters.isBestSeller = true;
      if (activeTab === 'discounts') filters.isDiscount = true;
      if (selectedCategory !== 'all') filters.category = selectedCategory;

      const dbData = await getProducts(filters);
      setProducts(dbData);
      setLoading(false);
    };

    fetchProducts();
  }, [activeTab, selectedCategory]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Luxury Hero Banner */}
          <section className="relative text-center py-10 px-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 border border-amber-500/20 shadow-2xl mb-8">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 mb-2">
              LAYAL's PERFUME
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm tracking-widest uppercase font-sans">
              A premium online fragrance boutique
            </p>
          </section>

          {/* Navigation & Filter Tabs */}
          <CategoryTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Product Showcase Grid */}
          <ProductGrid products={products} isLoading={loading} />
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}