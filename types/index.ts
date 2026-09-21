export type FragranceCategory = 'for_him' | 'for_her' | 'unisex';

export interface FragranceAccord {
  name: string;      // e.g. "Marine", "Citrus", "Woody", "Amber"
  percentage: number; // e.g. 90, 75, 60
  color?: string;     // e.g. "#1e3a8a" or default luxury palette
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  discount_price?: number | null;
  category: FragranceCategory;
  is_best_seller?: boolean;
  is_hot?: boolean;
  is_available?: boolean;
  stock_quantity?: number;
  thumbnail_url: string;
  images_urls?: string[];
  accords?: FragranceAccord[];
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  // Payload compatibility
  product_id?: string;
  title?: string;
  price?: number;
  thumbnail_url?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses?: number | null;
  times_used: number;
  is_one_time_per_user?: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  address?: string;
  total_amount: number;
  discount_amount?: number;
  promo_code_used?: string | null;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  customer_name?: string;
  rating: number;
  comment: string;
  created_at?: string;
}