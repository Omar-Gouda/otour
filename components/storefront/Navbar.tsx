'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Package, LogOut, LayoutDashboard, SlidersHorizontal, Menu, X, Home } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

export function Navbar() {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const checkAdminSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };

    checkAdminSession();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsMobileMenuOpen(false);
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-amber-200 hover:text-amber-300 transition-colors">
          LAYAL
        </Link>

        {/* Desktop View Action Icons */}
        <div className="hidden md:flex items-center gap-4">
          
          <Link
            href="/my-orders"
            className="p-2 text-zinc-400 hover:text-amber-300 transition-colors"
            title="Track My Orders"
          >
            <Package className="w-5 h-5" />
          </Link>

          <Link
            href="/wishlist"
            className="p-2 text-zinc-400 hover:text-rose-400 transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </Link>

          <Link
            href="/cart"
            className="p-2 text-zinc-400 hover:text-amber-300 transition-colors relative"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <Link
                href="/admin/dashboard"
                className="p-2 text-amber-400 hover:text-amber-300 transition-colors"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>

              <Link
                href="/admin/control-center"
                className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                title="Products Control Center"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Logout Admin"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>

        {/* Mobile View Controls (Cart + Hamburger Toggle) */}
        <div className="flex md:hidden items-center gap-2">
          
          <Link
            href="/cart"
            className="p-2 text-zinc-400 hover:text-amber-300 transition-colors relative"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-amber-300 transition-colors border border-zinc-800 rounded-lg cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Tidy Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 border-b border-zinc-800/80 px-4 py-4 space-y-3 font-mono text-xs animate-in fade-in duration-200">
          
          {/* Added Home Link */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-amber-300"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Home</span>
          </Link>

          <Link
            href="/my-orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-amber-300"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Track My Orders</span>
          </Link>

          <Link
            href="/wishlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-rose-400"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Wishlist</span>
            </div>
            {wishlist.length > 0 && (
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          {isAdmin && (
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block px-1">Admin Panel</span>
              
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </Link>

              <Link
                href="/admin/control-center"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-bold"
              >
                <SlidersHorizontal className="w-4 h-4 text-yellow-400" />
                <span>Products Control Center</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout Admin</span>
              </button>
            </div>
          )}

        </div>
      )}
    </header>
  );
}