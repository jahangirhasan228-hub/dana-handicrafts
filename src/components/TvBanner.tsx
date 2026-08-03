import React, { useState, useEffect } from 'react';
import { Product, StoreSettings } from '../types';
import { Tv, Flame, ShoppingBag, Sparkles, ChevronLeft, ChevronRight, Zap, Radio } from 'lucide-react';

interface TvBannerProps {
  products: Product[];
  settings: StoreSettings;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const TvBanner: React.FC<TvBannerProps> = ({
  products,
  settings,
  onSelectProduct,
  onAddToCart,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter top 10 products configured in settings
  const tvProductIds = settings.tvBannerProductIds || [];
  let tvProducts = products.filter((p) => tvProductIds.includes(p.id));
  if (tvProducts.length === 0) {
    tvProducts = products.slice(0, 10);
  } else {
    tvProducts = tvProducts.slice(0, 10);
  }

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!settings.showTvBanner || tvProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tvProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [tvProducts.length, settings.showTvBanner]);

  if (!settings.showTvBanner || tvProducts.length === 0) {
    return null;
  }

  const activeProduct = tvProducts[currentIndex] || tvProducts[0];

  const calculateDiscount = (price: number, orig?: number) => {
    if (!orig || orig <= price) return null;
    return Math.round(((orig - price) / orig) * 100);
  };

  const discountPercent = calculateDiscount(activeProduct.price, activeProduct.originalPrice);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-3xl border-2 border-emerald-500/40 p-4 sm:p-6 lg:p-8 shadow-2xl shadow-emerald-500/10">
      
      {/* TV Frame Header / Live Broadcast Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 animate-pulse flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-black uppercase tracking-widest text-rose-400">LIVE TV SHOW</span>
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Tv className="w-6 h-6 text-amber-400" />
              <span>{settings.tvBannerTitle || 'TOP 10 LIVE TV MEGA DEALS'}</span>
            </h2>
            <p className="text-xs text-emerald-300/80">
              {settings.tvBannerSubtitle || 'Limited Broadcast Stock - Huge Price Drop!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
          <span>Product #{currentIndex + 1} of {tvProducts.length}</span>
        </div>
      </div>

      {/* Main TV Screen Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        
        {/* Product Visual Container */}
        <div className="lg:col-span-6 relative group">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl">
            <img
              src={activeProduct.image}
              alt={activeProduct.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {discountPercent && (
              <div className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-sm px-3.5 py-1.5 rounded-full shadow-lg border border-rose-400 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>SAVE {discountPercent}% OFF</span>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-amber-400 font-mono text-xs px-3 py-1 rounded-lg border border-amber-500/30">
              TV OFFER LIMITED TIME
            </div>
          </div>

          {/* Nav Controls */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? tvProducts.length - 1 : prev - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-emerald-600 text-white p-2.5 rounded-full backdrop-blur-sm border border-white/20 transition-all shadow-md"
            title="Previous TV Offer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % tvProducts.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-emerald-600 text-white p-2.5 rounded-full backdrop-blur-sm border border-white/20 transition-all shadow-md"
            title="Next TV Offer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Category: {activeProduct.category}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
            {activeProduct.name}
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {activeProduct.description}
          </p>

          {/* Pricing Box */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-amber-400 font-sans">
                {settings.currency}{activeProduct.price.toLocaleString()}
              </span>
              {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                <span className="text-base text-slate-500 line-through">
                  {settings.currency}{activeProduct.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">
              ⚡ Delivery inside Dhaka 24 Hrs, outside Dhaka 48 Hrs
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onAddToCart(activeProduct)}
              className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 px-6 rounded-xl shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Order On TV Deal</span>
            </button>

            <button
              onClick={() => onSelectProduct(activeProduct)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-6 rounded-xl border border-slate-700 transition-all text-sm"
            >
              View Full Specs
            </button>
          </div>
        </div>

      </div>

      {/* Top 10 Thumbnail Selector Carousel */}
      <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          📺 Top 10 TV Featured Products Showcase:
        </span>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
          {tvProducts.map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all group/thumb aspect-square ${
                idx === currentIndex
                  ? 'border-amber-400 scale-105 shadow-lg shadow-amber-400/20'
                  : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
              }`}
            >
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-white text-[10px] font-black">
                #{idx + 1}
              </div>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};
