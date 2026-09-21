'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { getAllPromoCodes, createPromoCode } from '@/services/promo.service';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/products.service';
import { ProductModal } from '@/components/admin/ProductModal';
import { PromoModal } from '@/components/admin/PromoModal';
import { PromoCode, Product } from '@/types';
import { Tag, Plus, Trash2, Edit, Flame, ArrowLeft, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function AdminControlCenter() {
  const router = useRouter();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedPromos, fetchedProducts] = await Promise.all([
        getAllPromoCodes(),
        getProducts(),
      ]);
      setPromoCodes(fetchedPromos);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (productPayload: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productPayload);
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productPayload } : p))
      );
    } else {
      const newProd = await createProduct(productPayload);
      setProducts([newProd, ...products]);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePromo = async (code: string, type: 'percentage' | 'fixed', val: number, maxUses: string) => {
    const newPromo = await createPromoCode({
      code: code.trim().toUpperCase(),
      discount_type: type,
      discount_value: val,
      max_uses: maxUses ? parseInt(maxUses, 10) : null,
      is_active: true,
    });
    setPromoCodes([newPromo, ...promoCodes]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6">
        
        {/* Minimalist Navigation Link */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-300 transition-colors font-sans"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Clean Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-amber-200 uppercase tracking-wider">
              Control Center
            </h1>
            <p className="text-xs text-zinc-500">Manage Catalog & Promotional Coupons</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setIsPromoModalOpen(true)}
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none text-xs gap-1.5 border-zinc-800 hover:border-amber-500/40"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" /> Promo Code
            </Button>

            <Button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              size="sm"
              className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Perfume
            </Button>

            <Button onClick={fetchData} variant="secondary" size="sm" className="p-2 border-zinc-800 shrink-0">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* SECTION 1: PERFUME CATALOG TABLE */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-4">
          <h2 className="font-serif font-bold text-amber-300 text-base">
            Perfume Catalog ({products.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase">
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Badges</th>
                      <th className="py-3 px-4">In Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-900/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 bg-zinc-950 rounded-lg border border-zinc-800 shrink-0">
                              <Image src={p.thumbnail_url} alt={p.title} fill className="object-contain p-1" />
                            </div>
                            <span className="font-serif font-bold text-zinc-200">{p.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-400 uppercase text-[10px]">
                          {p.category.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-amber-300">
                          {p.discount_price ? (
                            <span>
                              {p.discount_price} EGP{' '}
                              <span className="text-[10px] text-zinc-500 line-through font-normal">{p.price} EGP</span>
                            </span>
                          ) : (
                            `${p.price} EGP`
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">{p.stock_quantity ?? 0}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {p.is_best_seller && (
                              <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] font-bold">
                                Best Seller
                              </span>
                            )}
                            {p.is_hot && (
                              <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[9px] font-bold flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5" /> Hot
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold uppercase ${p.is_available ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {p.is_available ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Cards */}
              <div className="md:hidden space-y-3">
                {products.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-zinc-900 rounded-lg border border-zinc-800 shrink-0">
                        <Image src={p.thumbnail_url} alt={p.title} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs text-zinc-100 truncate">{p.title}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-mono mt-0.5">{p.category.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-amber-300 bg-zinc-900 rounded-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 bg-zinc-900 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-zinc-800/60 pt-2">
                      <span className="font-serif font-bold text-amber-300">{p.discount_price ?? p.price} EGP</span>
                      <span className={`text-[10px] font-bold uppercase ${p.is_available ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {p.is_available ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* SECTION 2: PROMO CODES */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-4">
          <h2 className="font-serif font-bold text-amber-300 text-base">
            Promotional Coupons ({promoCodes.length})
          </h2>

          {promoCodes.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-2 text-center">No promo codes generated yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {promoCodes.map((p) => {
                const isExhausted = p.max_uses !== null && p.max_uses !== undefined && p.times_used >= p.max_uses;
                const isActive = p.is_active && !isExhausted;

                return (
                  <div key={p.id} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-amber-300 tracking-wider">{p.code}</span>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {p.discount_type === 'percentage' ? `${p.discount_value}% OFF` : `-${p.discount_value} EGP`} • Used: {p.times_used}/{p.max_uses ?? '∞'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isActive ? 'Active' : 'Exhausted'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      <PromoModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        onSave={handleSavePromo}
      />
    </div>
  );
}