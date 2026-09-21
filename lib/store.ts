import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

export interface AppStore {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  moveToWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product: Product) => {
        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.product.id === product.id);
          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity += 1;
            return { cart: updatedCart };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      toggleWishlist: (product: Product) => {
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id);
          if (exists) {
            return { wishlist: state.wishlist.filter((p) => p.id !== product.id) };
          }
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