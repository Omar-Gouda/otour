import { createClient } from '@/lib/supabase/client';
import { Order } from '@/types';

export const createOrder = async (orderData: {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  items: any[];
}) => {
  const supabase = createClient();

  // Generate unique order code (e.g., AURA-8X2K9P)
  const order_code = `AURA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const payload = {
    order_code,
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    address: orderData.customer_address, // <--- Fixed to match Supabase column 'address'
    total_amount: orderData.total_amount,
    items: orderData.items,
    status: 'pending',
  };

  const { data, error } = await supabase
    .from('orders')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating order in Supabase:', error);
    throw error;
  }

  return data as Order;
};

export const getOrderByCode = async (code: string): Promise<Order | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_code', code)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Order;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Order[];
};

export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  return data;
};