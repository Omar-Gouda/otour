export type FragranceCategory = 'for_him' | 'for_her' | 'unisex';
export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  discount_price?: number;
  category: FragranceCategory;
  thumbnail_url: string;
  images_urls?: string[];
  is_best_seller: boolean;
  is_hot: boolean;
  is_available: boolean;
  stock_quantity: number;
  created_at?: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail_url: string;
}

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_visits: number;
  total_orders: number;
  conversion_rate: number;
  delivered_orders: number;
  pending_orders: number;
  total_revenue: number;
}