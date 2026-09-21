'use client';

import React from 'react';
import { FragranceAccord } from '@/types';

interface AccordsBarProps {
  accords?: FragranceAccord[];
}

// ألوان افتراضية فاخرة تعكس كل نوع أكورد بأسلوب راقي
const DEFAULT_ACCORD_COLORS: Record<string, string> = {
  marine: 'bg-blue-600/80 text-white',
  citrus: 'bg-yellow-500/80 text-black',
  aromatic: 'bg-emerald-700/80 text-white',
  woody: 'bg-amber-900/80 text-amber-100',
  amber: 'bg-amber-600/80 text-black',
  spicy: 'bg-red-700/80 text-white',
  powdery: 'bg-zinc-400/80 text-black',
  sweet: 'bg-pink-600/80 text-white',
  floral: 'bg-rose-400/80 text-black',
  vanilla: 'bg-amber-200/90 text-black',
};

export const AccordsBar: React.FC<AccordsBarProps> = ({ accords }) => {
  // شرطك الأساسي: لو مفيش أكوردات مضافه للمنتج، الحاوية بالكامل مش هتبان ولا تؤثر على الـ UI
  if (!accords || accords.length === 0) return null;

  return (
    <div className="space-y-3 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
      <h3 className="font-serif font-bold text-xs uppercase tracking-[0.2em] text-amber-300">
        Main Accords
      </h3>

      <div className="space-y-2 max-w-md">
        {accords.map((accord, idx) => {
          const key = accord.name.toLowerCase().trim();
          const colorClass = DEFAULT_ACCORD_COLORS[key] || 'bg-amber-500/80 text-black';
          const widthPercent = Math.min(100, Math.max(15, accord.percentage || 100));

          return (
            <div key={idx} className="relative w-full bg-zinc-950/80 rounded-lg overflow-hidden h-7 border border-zinc-800/50 flex items-center">
              {/* Progress Bar with custom width */}
              <div
                className={`h-full ${colorClass} transition-all duration-700 rounded-r-md flex items-center px-3 shadow-md`}
                style={{ width: `${widthPercent}%` }}
              >
                <span className="font-sans font-bold text-[11px] capitalize tracking-wide whitespace-nowrap">
                  {accord.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};