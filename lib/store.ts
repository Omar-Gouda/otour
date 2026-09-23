import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

export interface AppStore {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, showToastFn?: (msg: string, type?: 'success' | 'error' | 'info') => void) => void;
  removeFromCart: (productId: string, showToastFn?: (msg: string, type?: 'success' | 'error' | 'info') => void) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product, showToastFn?: (msg: string, type?: 'success' | 'error' | 'info') => void) => void;
  moveToWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product: Product, showToastFn) => {
        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.product.id === product.id);
          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity += 1;
            if (showToastFn) showToastFn(`Increased quantity of "${product.title}" in bag`, 'success');
            return { cart: updatedCart };
          }
          if (showToastFn) showToastFn(`"${product.title}" added to your bag`, 'success');
          return { cart: [...state.cart, { product, quantity: 1 }] };
        });
      },

      removeFromCart: (productId: string, showToastFn) => {
        set((state) => {
          const item = state.cart.find((i) => i.product.id === productId);
          if (showToastFn && item) showToastFn(`"${item.product.title}" removed from bag`, 'info');
          return {
            cart: state.cart.filter((item) => item.product.id !== productId),
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.product.id !== productId) };
          }
          return {
            cart: state.cart.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      toggleWishlist: (product: Product, showToastFn) => {
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id);
          if (exists) {
            if (showToastFn) showToastFn(`Removed from wishlist`, 'info');
            return { wishlist: state.wishlist.filter((p) => p.id !== product.id) };
          }
          if (showToastFn) showToastFn(`Added to wishlist`, 'success');
          return { wishlist: [...state.wishlist, product] };
        });
      },

      moveToWishlist: (productId: string) => {
        set((state) => {
          const item = state.cart.find((i) => i.product.id === productId);
          const updatedCart = state.cart.filter((i) => i.product.id !== productId);
          const alreadyInWishlist = state.wishlist.some((p) => p.id === productId);

          return {
            cart: updatedCart,
            wishlist: item && !alreadyInWishlist ? [...state.wishlist, item.product] : state.wishlist,
          };
        });
      },

      isInWishlist: (productId: string) => {
        return get().wishlist.some((p) => p.id === productId);
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'aura-luxe-storage',
    }
  )
);