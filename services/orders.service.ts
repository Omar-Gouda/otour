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

  const order_code = `AURA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const payload = {
    order_code,
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    address: orderData.customer_address,
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
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Order;
};

// Search by single Order Code OR Customer Phone
export const getOrderByCodeAndPhone = async (searchTerm: string): Promise<Order[] | null> => {
  const supabase = createClient();
  const cleanSearch = searchTerm.trim();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .or(`order_code.eq.${cleanSearch},customer_phone.eq.${cleanSearch}`)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return null;
  }

  return data as Order[];
};

// Fetch list of orders from array of stored codes
export const getOrdersByCodes = async (codes: string[]): Promise<Order[]> => {
  if (!codes || codes.length === 0) return [];
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .in('order_code', codes)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Order[];
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