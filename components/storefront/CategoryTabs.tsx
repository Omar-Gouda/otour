'use client';

import React from 'react';
import { FragranceCategory } from '@/types';

interface CategoryTabsProps {
  activeTab: 'general' | 'bestsellers' | 'discounts';
  onTabChange: (tab: 'general' | 'bestsellers' | 'discounts') => void;
  selectedCategory: FragranceCategory | 'all';
  onCategoryChange: (category: FragranceCategory | 'all') => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onTabChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-4 mb-8 w-full overflow-hidden">
      
      {/* Primary Collection Filter */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={() => onTabChange('general')}
          className={`px-4 sm:px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
            activeTab === 'general'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
          }`}
        >
          All Fragrances
        </button>

        <button
          onClick={() => onTabChange('bestsellers')}
          className={`px-4 sm:px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
            activeTab === 'bestsellers'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
          }`}
        >
          Best Sellers
        </button>

        <button
          onClick={() => onTabChange('discounts')}
          className={`px-4 sm:px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
            activeTab === 'discounts'
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
          }`}
        >
          Special Offers
        </button>
      </div>

      {/* Sub Category Filters */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-[11px]">
        {[
          { id: 'all', label: 'ALL CATEGORIES' },
          { id: 'for_him', label: 'FOR HIM' },
          { id: 'for_her', label: 'FOR HER' },
          { id: 'unisex', label: 'UNISEX' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id as FragranceCategory | 'all')}
            className={`px-3 py-1.5 rounded-lg font-mono uppercase tracking-widest transition-colors ${
              selectedCategory === cat.id
                ? 'bg-purple-900/60 text-purple-200 border border-purple-500/50'
                : 'bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 border border-zinc-800/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

    </div>
  );
};