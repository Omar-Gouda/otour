export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number | null;
  category: 'for_him' | 'for_her' | 'unisex';
  is_best_seller?: boolean;
  is_hot?: boolean;
  is_available: boolean;
  stock_quantity?: number; // <--- Zood `?` hena
  thumbnail_url: string;
  images_urls?: string[];
}