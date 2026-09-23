import { createClient } from '@/lib/supabase/client';
import { Order, CartItem, OrderStatus, BillingDetails } from '@/types';

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

export const getOrderByCode = async (code: string): Promise<Order | null> => {
  const supabase = createClient();
  const cleanCode = code.trim();

  let { data: ordersData } = await supabase
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

  // Fetch from order_items table first
  const { data: itemsData } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .eq('order_id', ordersData.id);

  // Fallback to orders.items JSON column if order_items is empty
  const resolvedItems = itemsData && itemsData.length > 0 
    ? itemsData 
    : (Array.isArray(ordersData.items) ? ordersData.items.map((it: any) => ({
        product_id: it.product_id || '',
        quantity: it.quantity || 1,
        unit_price: it.price || it.unit_price || 0,
        product: { title: it.product_title || 'Luxury Fragrance' }
      })) : []);

  return {
    ...ordersData,
    tracking_code: ordersData.tracking_code || ordersData.order_code,
    order_code: ordersData.order_code || ordersData.tracking_code,
    items: resolvedItems,
  } as Order;
};

export const getOrderByTrackingCode = getOrderByCode;

export const searchOrdersFlexible = async (query: string): Promise<Order[]> => {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const supabase = createClient();
  
  const { data: ordersData, error } = await supabase
    .from('orders')
    .select('*')
    .or(`order_code.ilike.%${cleanQuery}%,customer_phone.ilike.%${cleanQuery}%`)
    .order('created_at', { ascending: false });

  if (error) {
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

export const createOrder = async (orderData: BillingDetails & {
  items: CartItem[];
  total_amount: number;
}): Promise<{ trackingCode: string; whatsappUrl: string }> => {
  const supabase = createClient();

  const orderCode = `LYL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // Tarteeb nazam al-address bi-diqah
  const fullAddress = [
    orderData.street_address,
    `Building ${orderData.building_number}`,
    orderData.floor ? `Floor ${orderData.floor}` : null,
    orderData.apartment ? `Apt ${orderData.apartment}` : null,
    orderData.area,
    orderData.city,
    orderData.landmark ? `Landmark: ${orderData.landmark}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const formattedItems = orderData.items.map((item) => ({
    product_title: item.product.title,
    quantity: item.quantity,
    price: item.product.discount_price ?? item.product.price,
  }));

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        order_code: orderCode,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        address: fullAddress,
        total_amount: orderData.total_amount,
        status: 'pending',
        items: formattedItems,
      },
    ])
    .select()
    .single();

  if (orderError || !order) {
    console.error('Detailed Supabase order error:', JSON.stringify(orderError, null, 2));
    throw new Error(orderError?.message || 'Failed to create order');
  }

  try {
    const orderItemsPayload = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.discount_price ?? item.product.price,
    }));
    await supabase.from('order_items').insert(orderItemsPayload);

    // Reduction of product stock quantities
    for (const item of orderData.items) {
      const newStock = Math.max(0, (item.product.stock_quantity || 0) - item.quantity);
      await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', item.product.id);
    }
  } catch (e) {
    console.error('Error updating stock or items:', e);
  }

  // Fixing WhatsApp Number configuration (Fallback to admin phone securely)
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || '201111902532';
  
  const itemLines = orderData.items
    .map((item, index) => {
      const unitPrice = item.product.discount_price ?? item.product.price;
      return `${index + 1}. ${item.product.title} x${item.quantity} - ${unitPrice * item.quantity} EGP`;
    })
    .join('\n');

  const message = [
    `✨ *New LAYAL Order: ${orderCode}* ✨`,
    '',
    '👤 *Customer Details:*',
    `Name: ${orderData.customer_name}`,
    `Phone: ${orderData.customer_phone}`,
    orderData.customer_alt_phone ? `Alt Phone: ${orderData.customer_alt_phone}` : null,
    orderData.customer_email ? `Email: ${orderData.customer_email}` : null,
    '',
    '📍 *Shipping Address:*',
    `City: ${orderData.city}`,
    `Area: ${orderData.area}`,
    `Street: ${orderData.street_address}`,
    `Building: ${orderData.building_number}`,
    orderData.floor ? `Floor: ${orderData.floor}` : null,
    orderData.apartment ? `Apt: ${orderData.apartment}` : null,
    orderData.landmark ? `Landmark: ${orderData.landmark}` : null,
    orderData.delivery_notes ? `Notes: ${orderData.delivery_notes}` : null,
    '',
    `💳 *Payment:* ${orderData.payment_method}`,
    '',
    '🛍️ *Items:*',
    itemLines,
    '',
    `💰 *Total Amount:* ${orderData.total_amount} EGP`,
  ]
    .filter(Boolean)
    .join('\n');

  const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

  return { trackingCode: orderCode, whatsappUrl };
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
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