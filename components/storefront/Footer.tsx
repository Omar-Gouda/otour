'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zinc-950 border-t border-amber-500/10 text-zinc-400 font-sans mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Upper Brand & Navigation Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900 text-left">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg tracking-[0.25em] text-amber-200 uppercase">
              LAYAL
            </h3>
            <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-widest leading-relaxed">
              Haute Parfumerie & Niche Fragrances
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-[0.2em] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/" className="hover:text-amber-200 transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-amber-200 transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-amber-200 transition-colors">
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-[0.2em] mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/my-orders" className="hover:text-amber-200 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send?phone=201111902532"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-200 transition-colors"
                >
                  Concierge Support
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Assurance */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-[0.2em] mb-4">
              Authenticity
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Guaranteed genuine formulations packaged with utmost luxury standards.
            </p>
          </div>
        </div>

        {/* Lower Studio Signature Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-600 font-mono">
          <p>© {new Date().getFullYear()} LAYAL PERFUMES. All Rights Reserved.</p>

          <p className="text-zinc-500 font-sans tracking-wide">
            Designed & Engineered by{' '}
            <span className="text-amber-300 font-serif font-bold tracking-wider hover:text-amber-200 transition-colors cursor-default">
              Omar Gouda
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};