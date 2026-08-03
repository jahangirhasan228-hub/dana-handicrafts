import React from 'react';
import { Product, Category, StoreSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { TvBanner } from '../components/TvBanner';
import { AdBanner } from '../components/AdBanner';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Headphones, Truck } from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  setCurrentView: (view: string) => void;
  setSelectedCategory: (cat: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  settings,
  onSelectProduct,
  onAddToCart,
  setCurrentView,
  setSelectedCategory,
}) => {
  const featuredProducts = products.filter((p) => p.featured || p.rating >= 4.7).slice(0, 8);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Top Ad Banner if Enabled */}
      {settings.showAds && (settings.topBannerAdImageUrl || settings.topBannerAdCode) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <AdBanner
            type="top"
            imageUrl={settings.topBannerAdImageUrl}
            linkUrl={settings.topBannerAdLink}
            adCode={settings.topBannerAdCode}
          />
        </div>
      )}

      {/* Top 10 TV Banner Section */}
      {settings.showTvBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TvBanner
            products={products}
            settings={settings}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
          alt="Hero Cover"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-12 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Premium Shopping Experience in Bangladesh</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Upgrade Your Lifestyle with <span className="text-emerald-400">{settings.storeName || 'Dana Shop'}</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {settings.siteDescription || 'Discover handpicked tech gadgets, authentic skincare, executive leatherwear, and trendy lifestyle essentials delivered fast to your doorstep.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setCurrentView('shop')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 text-sm active:scale-95"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('track-order')}
                className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Track Order</span>
              </button>
            </div>
          </div>

          {/* Featured Highlight Card */}
          {featuredProducts.length > 0 && (
            <div className="hidden lg:block bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold uppercase tracking-wider">
                <span>⚡ Deal of the Day</span>
                <span className="bg-rose-500 text-white px-2 py-0.5 rounded-md font-mono">30% OFF</span>
              </div>
              <div className="flex gap-4 items-center">
                <img
                  src={featuredProducts[0].image}
                  alt={featuredProducts[0].name}
                  className="w-24 h-24 object-cover rounded-xl border border-white/20 shadow-md"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base line-clamp-2">
                    {featuredProducts[0].name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{featuredProducts[0].description}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xl font-extrabold text-emerald-400">
                      {settings.currency}{featuredProducts[0].price.toLocaleString()}
                    </span>
                    {featuredProducts[0].originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {settings.currency}{featuredProducts[0].originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onSelectProduct(featuredProducts[0])}
                className="w-full bg-white text-slate-950 font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-400 transition-colors shadow-md"
              >
                View Product Details
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Explore our most popular product lines</p>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.name);
                setCurrentView('shop');
              }}
              className="group bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Flash Sale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 fill-rose-600" />
              <span>Trending & Top Rated</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Popular Products</h2>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Large Bottom Ad Banner if Enabled */}
      {settings.showAds && (settings.largeAdImageUrl || settings.largeAdCode) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner
            type="large"
            imageUrl={settings.largeAdImageUrl}
            linkUrl={settings.largeAdLink}
            adCode={settings.largeAdCode}
          />
        </div>
      )}

      {/* Trust & Guarantee Banner */}
      <section className="bg-emerald-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-4xl space-y-4 relative z-10">
          <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
            Customer Guarantee
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Seamless Ordering & bKash / Cash on Delivery Payment
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Order online with complete peace of mind. We accept direct bKash / Nagad mobile transfers as well as cash payment upon receiving your parcel.
          </p>
          <div className="pt-2 flex flex-wrap gap-6 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>7 Days Exchange Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              <span>Home Delivery Nationwide</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-amber-400" />
              <span>Dedicated Helpline: {settings.phone}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
