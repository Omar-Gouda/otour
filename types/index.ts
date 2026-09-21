export type FragranceCategory = 'for_him' | 'for_her' | 'unisex';

export interface FragranceAccord {
  name: string;
  percentage: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number | null;
  stock_quantity: number;
  category: FragranceCategory;
  thumbnail_url: string;
  image_urls?: string[];
  volume_ml?: number;
  accords?: FragranceAccord[];
  is_available: boolean;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_hot?: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface Order {
  id: string;
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  city: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  reviewer_name?: string;
  user_name?: string;
  author_name?: string;
  customer_name?: string;
  rating: number;
  comment: string;
  product_title?: string;
  products?: { title: string };
  created_at?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  is_active: boolean;
  created_at?: string;
}