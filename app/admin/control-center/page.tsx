'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/products.service';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Edit3, Trash2, Plus, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function ControlCenterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await deleteProduct(deletingId);
      setDeletingId(null);
      await loadProducts();
    }
  };

  const handleFormSubmit = async (productData: Partial<Product>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
    } else {
      await createProduct(productData as Omit<Product, 'id'>);
    }
    await loadProducts();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10 selection:bg-amber-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-amber-300">Control Center</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage fragrance catalog, stock levels, tags, and pricing</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="secondary" className="gap-2 text-xs">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Button>
            </Link>
            <Button onClick={handleOpenAdd} className="gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs">
              <Plus className="w-4 h-4" /> Add New Fragrance
            </Button>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif text-amber-200">Catalog Products ({products.length})</h2>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Perfume</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500 font-serif">
                        No products found in catalog. Click "Add New Fragrance" to get started.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-900/80 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={product.thumbnail_url}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded-lg border border-zinc-800"
                          />
                          <div>
                            <p className="font-bold text-zinc-100 text-sm">{product.title}</p>
                            <div className="flex gap-1.5 mt-1">
                              {product.is_best_seller && <Badge variant="bestseller">Best Seller</Badge>}
                              {product.is_hot && <Badge variant="hot">Hot 🔥</Badge>}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 uppercase font-semibold text-zinc-400">
                          {product.category.replace('_', ' ')}
                        </td>

                        <td className="p-4">
                          {product.discount_price ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-amber-300">{product.discount_price} EGP</span>
                              <span className="text-[10px] text-zinc-500 line-through">{product.price} EGP</span>
                            </div>
                          ) : (
                            <span className="font-bold text-amber-300">{product.price} EGP</span>
                          )}
                        </td>

                        <td className="p-4">
                          {product.is_available && (product.stock_quantity ?? 1) > 0 ? (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              In Stock ({product.stock_quantity ?? '10'})
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Out of Stock
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-zinc-700 transition-all"
                              title="Edit Details & Stock"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeletingId(product.id)}
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 border border-zinc-700 transition-all"
                              title="Delete Perfume"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
      />

      {/* Custom Luxury Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Remove Fragrance"
        message="Are you sure you want to delete this perfume from the catalog? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Keep Perfume"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}