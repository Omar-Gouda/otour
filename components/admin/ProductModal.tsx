'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Product, FragranceCategory, FragranceAccord } from '@/types';
import { X } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => Promise<void>;
  editingProduct: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}) => {
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState<FragranceCategory>('for_him');
  const [prodPrice, setProdPrice] = useState<number>(2500);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<string>('');
  const [prodThumbnail, setProdThumbnail] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodStock, setProdStock] = useState<number>(50);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsHot, setProdIsHot] = useState(false);
  const [prodIsAvailable, setProdIsAvailable] = useState(true);
  const [accordsInput, setAccordsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setProdTitle(editingProduct.title);
      setProdCategory(editingProduct.category);
      setProdPrice(editingProduct.price);
      setProdDiscountPrice(editingProduct.discount_price ? String(editingProduct.discount_price) : '');
      setProdThumbnail(editingProduct.thumbnail_url);
      setProdDescription(editingProduct.description || '');
      setProdStock(editingProduct.stock_quantity ?? 50);
      setProdIsBestSeller(Boolean(editingProduct.is_best_seller));
      setProdIsHot(Boolean(editingProduct.is_hot));
      setProdIsAvailable(Boolean(editingProduct.is_available));
      
      if (editingProduct.accords && editingProduct.accords.length > 0) {
        const formatted = editingProduct.accords.map(a => `${a.name}:${a.percentage}`).join(', ');
        setAccordsInput(formatted);
      } else {
        setAccordsInput('');
      }
    } else {
      setProdTitle('');
      setProdCategory('for_him');
      setProdPrice(2500);
      setProdDiscountPrice('');
      setProdThumbnail('');
      setProdDescription('');
      setProdStock(50);
      setProdIsBestSeller(false);
      setProdIsHot(false);
      setProdIsAvailable(true);
      setAccordsInput('');
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const parseAccords = (raw: string): FragranceAccord[] => {
    if (!raw.trim()) return [];
    return raw
      .split(',')
      .map((item) => {
        const parts = item.split(':');
        const name = parts[0]?.trim() || '';
        const pct = parts[1] ? Number(parts[1].trim()) : 80;
        return {
          name,
          percentage: isNaN(pct) ? 80 : pct,
        };
      })
      .filter((a) => a.name.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodThumbnail.trim() || prodPrice <= 0) return;

    setIsSaving(true);
    try {
      const parsedAccords = parseAccords(accordsInput);

      await onSave({
        title: prodTitle.trim(),
        category: prodCategory,
        price: Number(prodPrice),
        discount_price: prodDiscountPrice ? Number(prodDiscountPrice) : null,
        thumbnail_url: prodThumbnail.trim(),
        description: prodDescription.trim(),
        stock_quantity: Number(prodStock),
        is_best_seller: prodIsBestSeller,
        is_hot: prodIsHot,
        is_available: prodIsAvailable,
        accords: parsedAccords,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-serif font-bold text-amber-300">
          {editingProduct ? 'Edit Perfume Details' : 'Add New Perfume'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Title</label>
            <input
              type="text"
              required
              value={prodTitle}
              onChange={(e) => setProdTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Category</label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value as FragranceCategory)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="for_him">For Him</option>
                <option value="for_her">For Her</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Stock Qty</label>
              <input
                type="number"
                min={0}
                value={prodStock}
                onChange={(e) => setProdStock(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Price (EGP)</label>
              <input
                type="number"
                required
                min={1}
                value={prodPrice}
                onChange={(e) => setProdPrice(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Sale Price (Optional)</label>
              <input
                type="number"
                value={prodDiscountPrice}
                onChange={(e) => setProdDiscountPrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Thumbnail Image URL</label>
            <input
              type="url"
              required
              value={prodThumbnail}
              onChange={(e) => setProdThumbnail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Description</label>
            <textarea
              rows={2}
              value={prodDescription}
              onChange={(e) => setProdDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">
              Main Accords (Optional - e.g. Marine:90, Citrus:75, Woody:60)
            </label>
            <input
              type="text"
              value={accordsInput}
              onChange={(e) => setAccordsInput(e.target.value)}
              placeholder="Marine:90, Citrus:75, Woody:60"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800">
            <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={prodIsBestSeller}
                onChange={(e) => setProdIsBestSeller(e.target.checked)}
                className="rounded border-zinc-800 text-amber-500 bg-zinc-950"
              />
              Best Seller
            </label>

            <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={prodIsHot}
                onChange={(e) => setProdIsHot(e.target.checked)}
                className="rounded border-zinc-800 text-rose-500 bg-zinc-950"
              />
              Hot 🔥
            </label>

            <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={prodIsAvailable}
                onChange={(e) => setProdIsAvailable(e.target.checked)}
                className="rounded border-zinc-800 text-emerald-500 bg-zinc-950"
              />
              In Stock
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 text-xs uppercase mt-2"
          >
            {isSaving ? 'Saving...' : 'Save Product'}
          </Button>
        </form>
      </div>
    </div>
  );
};