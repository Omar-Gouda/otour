import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'bestseller' | 'discount' | 'hot' | 'outOfStock' | 'category';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'category' }) => {
  const styles = {
    bestseller: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    discount: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    hot: 'bg-amber-400/20 text-amber-200 border-amber-400/50',
    outOfStock: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    category: 'bg-zinc-900/90 text-amber-200/80 border-amber-500/30',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-[11px] font-semibold tracking-wider uppercase border rounded-md backdrop-blur-md ${styles[variant]}`}
    >
      {children}
    </span>
  );
};