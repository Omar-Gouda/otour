'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAdminActions } from '@/hooks/useAdminActions';
import { Navbar } from '@/components/storefront/Navbar';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ProductModal } from '@/components/admin/products/ProductModal';
import { PromoModal } from '@/components/admin/promo/PromoModal';
import { ProductsTable } from '@/components/admin/products/ProductsTable';
import { PromoCodesGrid } from '@/components/admin/promo/PromoCodesGrid';
import { Product } from '@/types';
import { Plus, Tag, Layers, Search } from 'lucide-react';
import Link from 'next/link';

export default function ControlCenterPage() {
  const { products, promoCodes, loading, refreshAll } = useApp();
  const { removeProduct, removePromo } = useAdminActions();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'product' | 'promo' | null;
    id: string | null;
    title: string;
  }>({ isOpen: false, type: null, id: null, title: '' });

  const handleConfirmDelete = async () => {
    if (!confirmModal.id || !confirmModal.type) return;

    if (confirmModal.type === 'product') {
      await removeProduct(confirmModal.id);
    } else {
      await removePromo(confirmModal.id);
    }

    setConfirmModal({ isOpen: false, type: null, id: null, title: '' });
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 sm:space-y-10">
        
        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-amber-950/20 to-zinc-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                LAYAL Catalog Management
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-200 tracking-wider">
                Products & Promos Control
              </h1>
            </div>

            <Link
              href="/admin/dashboard"
              className="px-4 py-2.5 bg-zinc-900 border border-zinc-700 text-amber-300 font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:bg-zinc-800 transition-all"
            >
              Executive Dashboard
            </Link>
          </div>
        </div>

        {/* Promo Codes Section */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
            <h2 className="font-serif font-bold text-amber-200 text-base uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" /> Active Promo Codes ({promoCodes.length})
            </h2>

            <button
              onClick={() => setIsPromoModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> Create Promo Code
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <PromoCodesGrid
              promoCodes={promoCodes}
              onDeleteRequest={(id, code) =>
                setConfirmModal({
                  isOpen: true,
                  type: 'promo',
                  id,
                  title: `Are you sure you want to delete promo code "${code}"?`,
                })
              }
            />
          )}
        </div>

        {/* Perfume Inventory Section */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
            <h2 className="font-serif font-bold text-amber-200 text-base uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Perfume Inventory ({products.length})
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs rounded-xl uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Perfume
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center py-10 text-xs text-zinc-500 font-mono">No perfumes match your search criteria.</p>
          ) : (
            <ProductsTable
              products={filteredProducts}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsProductModalOpen(true);
              }}
              onDeleteRequest={(id, title) =>
                setConfirmModal({
                  isOpen: true,
                  type: 'product',
                  id,
                  title: `Are you sure you want to delete product "${title}"?`,
                })
              }
            />
          )}
        </div>

      </main>

      {/* Modals */}
      {isProductModalOpen && (
        <ProductModal
          isOpen={isProductModalOpen}
          product={editingProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSuccess={refreshAll}
        />
      )}

      {isPromoModalOpen && (
        <PromoModal
          isOpen={isPromoModalOpen}
          onClose={() => setIsPromoModalOpen(false)}
          onSuccess={refreshAll}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Confirm Deletion"
        message={confirmModal.title}
        confirmText="Delete Item"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, id: null, title: '' })}
      />
    </div>
  );
}