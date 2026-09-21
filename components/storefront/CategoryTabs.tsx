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
  const mainTabs = [
    { id: 'general', label: 'All Fragrances' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'discounts', label: 'Special Offers' },
  ] as const;

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'for_him', label: 'For Him' },
    { id: 'for_her', label: 'For Her' },
    { id: 'unisex', label: 'Unisex' },
  ] as const;

  return (
    <div className="flex flex-col gap-6 my-8">
      {/* Main Tabs (General, Best Sellers, Discounts) */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 border-b border-zinc-800 pb-4 overflow-x-auto">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-lg shadow-purple-950/40 border border-purple-500/50'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-Categories (For Him, For Her, Unisex) */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
              selectedCategory === cat.id
                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-sm'
                : 'bg-zinc-950 text-zinc-500 hover:text-zinc-300 border border-zinc-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};