'use client';

import { useState, useEffect } from 'react';
import { Product, FragranceCategory } from '@/types';
import { createProduct, updateProduct } from '@/services/products.service';
import { X, Plus, Trash2, Sparkles, Flame, CheckCircle, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductModal({ isOpen, product, onClose, onSuccess }: ProductModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    discount_price: undefined as number | undefined,
    stock_quantity: 0,
    category: 'unisex' as FragranceCategory,
    volume_ml: 100,
    thumbnail_url: '',
    accords: [] as { name: string; percentage: number }[],
    is_available: true,
    is_featured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          title: product.title || '',
          description: product.description || '',
          price: product.price || 0,
          discount_price: product.discount_price ?? undefined,
          stock_quantity: product.stock_quantity ?? 0,
          category: product.category || 'unisex',
          volume_ml: product.volume_ml ?? 100,
          thumbnail_url: product.thumbnail_url || '',
          accords: product.accords && product.accords.length > 0 ? product.accords : [{ name: 'Woody', percentage: 50 }],
          is_available: product.is_available ?? true,
          is_featured: product.is_featured ?? product.is_best_seller ?? false,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          price: 0,
          discount_price: undefined,
          stock_quantity: 0,
          category: 'unisex',
          volume_ml: 100,
          thumbnail_url: '',
          accords: [{ name: 'Woody', percentage: 50 }],
          is_available: true,
          is_featured: false,
        });
      }
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Omit<Product, 'id' | 'created_at'> = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        stock_quantity: Number(formData.stock_quantity),
        category: formData.category,
        volume_ml: Number(formData.volume_ml),
        thumbnail_url: formData.thumbnail_url,
        accords: formData.accords,
        is_available: formData.is_available,
        is_featured: formData.is_featured,
      };

      if (product?.id) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccordChange = (index: number, field: 'name' | 'percentage', value: string | number) => {
    const updatedAccords = [...formData.accords];
    updatedAccords[index] = { ...updatedAccords[index], [field]: value };
    setFormData({ ...formData, accords: updatedAccords });
  };

  const addAccord = () => {
    setFormData({
      ...formData,
      accords: [...formData.accords, { name: '', percentage: 20 }],
    });
  };

  const removeAccord = (index: number) => {
    setFormData({
      ...formData,
      accords: formData.accords.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-amber-200 text-lg uppercase tracking-wider">
              {product ? `Edit Perfume: ${product.title}` : 'Add New Perfume'}
            </h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Perfume Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Fragrance Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as FragranceCategory })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              >
                <option value="for_him">For Him</option>
                <option value="for_her">For Her</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Price (EGP)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Discount Price (Optional)</label>
              <input
                type="number"
                value={formData.discount_price ?? ''}
                onChange={(e) => setFormData({ ...formData, discount_price: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Stock Quantity</label>
              <input
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-b border-zinc-800/80 py-3 my-2 space-y-2">
            <label className="text-[10px] text-amber-400 uppercase tracking-wider block">Product Status & Badges</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                formData.is_featured 
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}>
                <div className="flex items-center gap-2">
                  <Flame className={`w-4 h-4 ${formData.is_featured ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`} />
                  <div>
                    <span className="font-bold text-xs block">Featured / Bestseller</span>
                    <span className="text-[9px] text-zinc-500">Show badge on home catalog</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                formData.is_available 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/50 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {formData.is_available ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <PackageX className="w-4 h-4 text-rose-400" />
                  )}
                  <div>
                    <span className="font-bold text-xs block">
                      {formData.is_available ? 'Available for Purchase' : 'Mark Out of Stock'}
                    </span>
                    <span className="text-[9px] text-zinc-500">Toggle instant store availability</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Thumbnail Image URL</label>
              <input
                type="url"
                required
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Volume (ML)</label>
              <input
                type="number"
                value={formData.volume_ml}
                onChange={(e) => setFormData({ ...formData, volume_ml: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 border-t border-zinc-800 pt-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-amber-400 uppercase">Fragrance Accords</label>
              <button
                type="button"
                onClick={addAccord}
                className="text-amber-400 hover:underline text-[10px] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Accord
              </button>
            </div>

            {formData.accords.map((accord, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Accord Name (e.g., Amber)"
                  value={accord.name}
                  onChange={(e) => handleAccordChange(idx, 'name', e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
                />
                <input
                  type="number"
                  placeholder="%"
                  value={accord.percentage}
                  onChange={(e) => handleAccordChange(idx, 'percentage', Number(e.target.value))}
                  className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => removeAccord(idx)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider"
            >
              {isSubmitting ? 'Saving...' : product ? 'Update Perfume' : 'Create Perfume'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
