import { createClient } from '@/lib/supabase/client';
import { Order } from '@/types';

const supabase = createClient();

export const createOrder = async (
  orderData: Omit<Order, 'id' | 'order_code' | 'status' | 'created_at'>
) => {
  const orderCode = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;

  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...orderData, order_code: orderCode, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;

  // Save Order Code locally for guest tracking
  if (typeof window !== 'undefined') {
    const existingCodes = JSON.parse(localStorage.getItem('aura_luxe_orders') || '[]');
    localStorage.setItem('aura_luxe_orders', JSON.stringify([...existingCodes, orderCode]));
  }

  // Deduct Stock Quantity
  for (const item of orderData.items) {
    const { data: prod } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', item.product_id)
      .maybeSingle();

    if (prod && typeof prod.stock_quantity === 'number') {
      const newStock = Math.max(0, prod.stock_quantity - item.quantity);
      await supabase
        .from('products')
        .update({
          stock_quantity: newStock,
          is_available: newStock > 0,
        })
        .eq('id', item.product_id);
    }
  }

  return data as Order;
};

export const getOrderByCode = async (orderCode: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_code', orderCode.trim())
    .maybeSingle();

  if (error || !data) return null;
  return data as Order;
};

export const getOrdersByCodes = async (codes: string[]) => {
  if (!codes || codes.length === 0) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .in('order_code', codes)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as Order[];
};

export const getOrderByCodeAndPhone = async (orderCode: string, phone: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_code', orderCode.trim())
    .eq('customer_phone', phone.trim())
    .maybeSingle();

  if (error || !data) return null;
  return data as Order;
};

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as Order[];
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
};