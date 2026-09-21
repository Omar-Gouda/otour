import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppStore {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product) => {
        const { cart } = get();
        const existingIndex = cart.findIndex((item) => item.product.id === product.id);

        if (existingIndex > -1) {
          const updated = [...cart];
          updated[existingIndex].quantity += 1;
          set({ cart: updated });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      toggleWishlist: (product) => {
        const { wishlist } = get();
        const exists = wishlist.some((p) => p.id === product.id);

        if (exists) {
          set({ wishlist: wishlist.filter((p) => p.id !== product.id) });
        } else {
          set({ wishlist: [...wishlist, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((p) => p.id === productId);
      },
    }),
    {
      name: 'aura_luxe_store',
    }
  )
);