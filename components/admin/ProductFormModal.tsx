'use client';

import React, { useState, useEffect } from 'react';
import { Product, FragranceCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Partial<Product>) => Promise<void>;
  initialData?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState<FragranceCategory>('unisex');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isHot, setIsHot] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price ? initialData.price.toString() : '');
      setDiscountPrice(
        initialData.discount_price !== null && initialData.discount_price !== undefined
          ? initialData.discount_price.toString()
          : ''
      );
      setCategory(initialData.category || 'unisex');
      setThumbnailUrl(initialData.thumbnail_url || '');
      setStockQuantity(initialData.stock_quantity?.toString() ?? '10');
      setIsBestSeller(Boolean(initialData.is_best_seller));
      setIsHot(Boolean(initialData.is_hot));
      setIsAvailable(Boolean(initialData.is_available));
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setDiscountPrice('');
      setCategory('unisex');
      setThumbnailUrl('');
      setStockQuantity('10');
      setIsBestSeller(false);
      setIsHot(false);
      setIsAvailable(true);
    }
    setErrorText(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText(null);

    try {
      const parsedPrice = parseFloat(price);
      const parsedDiscount = discountPrice.trim() !== '' ? parseFloat(discountPrice) : null;
      const parsedStock = parseInt(stockQuantity, 10) || 0;

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        discount_price: parsedDiscount as any, // Send null to clear discount in Supabase
        category,
        thumbnail_url: thumbnailUrl.trim(),
        stock_quantity: parsedStock,
        is_best_seller: isBestSeller,
        is_hot: isHot,
        is_available: isAvailable && parsedStock > 0,
      });

      onClose();
    } catch (err: any) {
      console.error('Error submitting fragrance:', err);
      setErrorText(err?.message || 'Failed to save product. Please check image URL or fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-serif font-bold text-amber-300 mb-4">
          {initialData ? 'Edit Fragrance' : 'Add New Fragrance'}
        </h2>

        {errorText && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {errorText}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Price (EGP)</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Discount Price (EGP) <span className="text-[10px] text-zinc-500">(Leave empty to clear)</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Optional"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FragranceCategory)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="unisex">Unisex</option>
                <option value="for_him">For Him</option>
                <option value="for_her">For Her</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Image URL</label>
            <input
              type="text"
              required
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
              /> Best Seller
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isHot}
                onChange={(e) => setIsHot(e.target.checked)}
              /> Hot 🔥
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              /> In Stock
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold">
            {loading ? 'Saving...' : initialData ? 'Update Fragrance' : 'Create Fragrance'}
          </Button>
        </form>
      </div>
    </div>
  );
};