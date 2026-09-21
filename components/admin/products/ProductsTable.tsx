'use client';

import { Product } from '@/types';
import { Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDeleteRequest: (id: string, title: string) => void;
}

export function ProductsTable({ products, onEdit, onDeleteRequest }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead>
          <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-wider">
            <th className="py-3 px-3">Product</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Price</th>
            <th className="py-3 px-3">Stock Qty</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-zinc-900/60 transition-colors">
              <td className="py-3 px-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shrink-0">
                    <Image src={p.thumbnail_url} alt={p.title} fill className="object-cover" />
                  </div>
                  <span className="font-serif font-bold text-zinc-200 text-xs">{p.title}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-amber-300 uppercase text-[10px]">{p.category.replace('_', ' ')}</td>
              <td className="py-3 px-3 font-serif font-bold text-amber-300">{p.discount_price ?? p.price} EGP</td>
              <td className="py-3 px-3 font-bold">{p.stock_quantity} units</td>
              <td className="py-3 px-3">
                {p.is_available && p.stock_quantity > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-rose-400">
                    <XCircle className="w-3 h-3" /> Out of Stock
                  </span>
                )}
              </td>
              <td className="py-3 px-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteRequest(p.id, p.title)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}