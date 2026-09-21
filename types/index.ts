export type FragranceCategory = 'for_him' | 'for_her' | 'unisex';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number | null;
  category: FragranceCategory;
  is_best_seller?: boolean;
  is_hot?: boolean;
  is_available: boolean;
  stock_quantity?: number;
  thumbnail_url: string;
  images_urls?: string[];
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

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  address?: string;
  total_amount: number;
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