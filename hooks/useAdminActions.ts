'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { updateOrderStatus } from '@/services/orders.service';
import { deleteReview } from '@/services/reviews.service';
import { deleteProduct } from '@/services/products.service';
import { deletePromoCode } from '@/services/promo.service';
import { Order } from '@/types';

export function useAdminActions() {
  const { refreshOrders, refreshReviews, refreshProducts, refreshPromos } = useApp();
  const [actionLoading, setActionLoading] = useState(false);

  const changeOrderStatus = async (orderId: string, status: Order['status']) => {
    setActionLoading(true);
    try {
      await updateOrderStatus(orderId, status);
      await refreshOrders();
    } finally {
      setActionLoading(false);
    }
  };

  const removeReview = async (reviewId: string) => {
    setActionLoading(true);
    try {
      await deleteReview(reviewId);
      await refreshReviews();
    } finally {
      setActionLoading(false);
    }
  };

  const removeProduct = async (productId: string) => {
    setActionLoading(true);
    try {
      await deleteProduct(productId);
      await refreshProducts();
    } finally {
      setActionLoading(false);
    }
  };

  const removePromo = async (promoId: string) => {
    setActionLoading(true);
    try {
      await deletePromoCode(promoId);
      await refreshPromos();
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    changeOrderStatus,
    removeReview,
    removeProduct,
    removePromo,
  };
}