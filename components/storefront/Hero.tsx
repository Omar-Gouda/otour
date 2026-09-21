'use client';

export function Hero() {
  return (
    <section className="bg-zinc-950 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-amber-500/20 rounded-2xl py-12 sm:py-16 px-6 text-center space-y-3 shadow-2xl">
          
          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-[0.25em] text-amber-200 uppercase">
            LAYAL PERFUMES
          </h1>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase">
            A PREMIUM ONLINE FRAGRANCE BOUTIQUE
          </p>

        </div>
      </div>
    </section>
  );
}