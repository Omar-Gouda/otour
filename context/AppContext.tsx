'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Order, Review, PromoCode } from '@/types';
import { getProducts } from '@/services/products.service';
import { getAllOrders } from '@/services/orders.service';
import { getAllReviewsWithProduct } from '@/services/reviews.service';
import { getPromoCodes } from '@/services/promo.service';
import { createClient } from '@/lib/supabase/client';

interface AppContextType {
  products: Product[];
  orders: Order[];
  reviews: (Review & { product_title?: string })[];
  promoCodes: PromoCode[];
  isAdmin: boolean;
  loading: boolean;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshReviews: () => Promise<void>;
  refreshPromos: () => Promise<void>;
  refreshAll: () => Promise<void>;
  checkAdminSession: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<(Review & { product_title?: string })[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminSession = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    setIsAdmin(!!session);
  }, []);

  const refreshProducts = useCallback(async () => {
    const data = await getProducts();
    setProducts(data);
  }, []);

  const refreshOrders = useCallback(async () => {
    const data = await getAllOrders();
    setOrders(data);
  }, []);

  const refreshReviews = useCallback(async () => {
    const data = await getAllReviewsWithProduct();
    setReviews(data);
  }, []);

  const refreshPromos = useCallback(async () => {
    const data = await getPromoCodes();
    setPromoCodes(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      refreshProducts(),
      refreshOrders(),
      refreshReviews(),
      refreshPromos(),
      checkAdminSession(),
    ]);
    setLoading(false);
  }, [refreshProducts, refreshOrders, refreshReviews, refreshPromos, checkAdminSession]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshAll();
  }, [refreshAll]);

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        reviews,
        promoCodes,
        isAdmin,
        loading,
        refreshProducts,
        refreshOrders,
        refreshReviews,
        refreshPromos,
        refreshAll,
        checkAdminSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
