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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash_on_delivery' | 'instapay' | 'vodafone_cash' | 'card_on_delivery';

export interface BillingDetails {
  customer_name: string;
  customer_phone: string;
  customer_alt_phone?: string;
  customer_email?: string;
  city: string;
  area: string;
  street_address: string;
  building_number: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  delivery_notes?: string;
  payment_method: PaymentMethod;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface Order {
  id: string;
  tracking_code?: string;
  order_code?: string;
  customer_name: string;
  customer_phone: string;
  customer_alt_phone?: string;
  customer_email?: string;
  address: string;
  city?: string;
  area?: string;
  street_address?: string;
  building_number?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  delivery_notes?: string;
  payment_method?: PaymentMethod;
  total_amount: number;
  status: OrderStatus;
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
  product?: Product;
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