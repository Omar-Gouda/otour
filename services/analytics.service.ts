import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const getDashboardAnalytics = async () => {
  try {
    const { data: orders } = await supabase.from('orders').select('*');
    const { data: products } = await supabase.from('products').select('*');
    const { count: visitsCount } = await supabase.from('site_visits').select('*', { count: 'exact', head: true });

    if (!orders) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalProducts: products?.length || 0,
        siteVisits: visitsCount || 0,
      };
    }

    const totalRevenue = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      deliveredOrders,
      totalProducts: products?.length || 0,
      siteVisits: visitsCount || 0,
    };
  } catch {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      totalProducts: 0,
      siteVisits: 0,
    };
  }
};