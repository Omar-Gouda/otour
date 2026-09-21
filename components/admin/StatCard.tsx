'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  borderColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-amber-400',
  borderColor = 'border-zinc-800',
}) => {
  return (
    <div className={`bg-zinc-900 border ${borderColor} p-6 rounded-2xl shadow-xl transition-all hover:border-amber-500/40`}>
      <div className="flex items-center justify-between text-zinc-400 mb-2">
        <span className="text-xs uppercase font-semibold tracking-wider">{title}</span>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <p className="text-2xl font-bold text-zinc-100 tracking-tight">{value}</p>
    </div>
  );
};