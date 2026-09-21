import { createClient } from '@/lib/supabase/client';
import { Order, CartItem } from '@/types';

/**
 * Fetch all orders for admin dashboard & management (Safe fetch with manual items mapping)
 */
export const getOrders = async (): Promise<Order[]> => {
  const supabase = createClient();
  
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders table:', ordersError);
    return [];
  }

  if (!ordersData || ordersData.length === 0) {
    return [];
  }

  const orderIds = ordersData.map((o) => o.id);
  const { data: itemsData } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .in('order_id', orderIds);

  const ordersWithItems = ordersData.map((ord) => ({
    ...ord,
    tracking_code: ord.tracking_code || ord.order_code,
    order_code: ord.order_code || ord.tracking_code,
    items: itemsData?.filter((item) => item.order_id === ord.id) || [],
  }));

  return ordersWithItems as Order[];
};

export const getAllOrders = getOrders;

/**
 * Fetch a single order by its code
 */
export const getOrderByCode = async (code: string): Promise<Order | null> => {
  const supabase = createClient();
  const cleanCode = code.trim();

  // Try fetching by order_code first, then tracking_code
  let { data: ordersData, error } = await supabase
    .from('orders')
    .select('*')
    .ilike('order_code', cleanCode)
    .maybeSingle();

  if (!ordersData) {
    const res = await supabase
      .from('orders')
      .select('*')
      .ilike('tracking_code', cleanCode)
      .maybeSingle();
    ordersData = res.data;
  }

  if (!ordersData) {
    return null;
  }

  const { data: itemsData } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .eq('order_id', ordersData.id);

  return {
    ...ordersData,
    tracking_code: ordersData.tracking_code || ordersData.order_code,
    order_code: ordersData.order_code || ordersData.tracking_code,
    items: itemsData || [],
  } as Order;
};

export const getOrderByTrackingCode = getOrderByCode;

/**
 * Flexible order search by order code or phone number
 */
export const searchOrdersFlexible = async (query: string): Promise<Order[]> => {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const supabase = createClient();
  
  // Search using order_code and customer_phone safely
  const { data: ordersData, error } = await supabase
    .from('orders')
    .select('*')
    .or(`order_code.ilike.%${cleanQuery}%,tracking_code.ilike.%${cleanQuery}%,customer_phone.ilike.%${cleanQuery}%`)
    .order('created_at', { ascending: false });

  if (error) {
    // Fallback search if .or fails
    const { data: fallbackData } = await supabase
      .from('orders')
      .select('*')
      .ilike('customer_phone', `%${cleanQuery}%`)
      .order('created_at', { ascending: false });

    if (!fallbackData || fallbackData.length === 0) return [];
    
    const orderIds = fallbackData.map((o) => o.id);
    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*, product:products(*)')
      .in('order_id', orderIds);

    return fallbackData.map((ord) => ({
      ...ord,
      tracking_code: ord.tracking_code || ord.order_code,
      order_code: ord.order_code || ord.tracking_code,
      items: itemsData?.filter((item) => item.order_id === ord.id) || [],
    })) as Order[];
  }

  if (!ordersData || ordersData.length === 0) {
    return [];
  }

  const orderIds = ordersData.map((o) => o.id);
  const { data: itemsData } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .in('order_id', orderIds);

  return ordersData.map((ord) => ({
    ...ord,
    tracking_code: ord.tracking_code || ord.order_code,
    order_code: ord.order_code || ord.tracking_code,
    items: itemsData?.filter((item) => item.order_id === ord.id) || [],
  })) as Order[];
};

/**
 * Create a new customer order along with its order items
 */
export const createOrder = async (orderData: {
  customer_name: string;
  customer_phone: string;
  address: string;
  city: string;
  items: CartItem[];
  total_amount: number;
}): Promise<{ trackingCode: string }> => {
  const supabase = createClient();

  const orderCode = `LYL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        order_code: orderCode,
        tracking_code: orderCode,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        address: orderData.address,
        city: orderData.city,
        total_amount: orderData.total_amount,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (orderError || !order) {
    console.error('Detailed Supabase order error:', JSON.stringify(orderError, null, 2));
    throw new Error(orderError?.message || 'Failed to create order');
  }

  const orderItemsPayload = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    unit_price: item.product.discount_price ?? item.product.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsPayload);

  if (itemsError) {
    console.error('Detailed Supabase order items error:', JSON.stringify(itemsError, null, 2));
    throw new Error(itemsError.message || 'Failed to attach items to order');
  }

  return { trackingCode: orderCode };
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Delete an order
 */
export const deleteOrder = async (orderId: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};