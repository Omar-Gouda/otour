'use client';

import { useState, useEffect } from 'react';
import { Product, FragranceCategory } from '@/types';
import { createProduct, updateProduct } from '@/services/products.service';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductFormModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductFormModal({ isOpen, product, onClose, onSuccess }: ProductFormModalProps) {
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
    is_best_seller: false,
    is_hot: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product) {
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
          is_featured: product.is_featured ?? false,
          is_best_seller: product.is_best_seller ?? false,
          is_hot: product.is_hot ?? false,
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
          is_best_seller: false,
          is_hot: false,
        });
      }
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Partial<Product> = {
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
        is_best_seller: formData.is_best_seller,
        is_hot: formData.is_hot,
      };

      if (product?.id) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload as any);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-amber-200 font-bold uppercase">{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-zinc-400 uppercase">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-amber-300"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-amber-500 text-black font-bold">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}