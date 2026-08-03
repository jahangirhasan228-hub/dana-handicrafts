import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, User, ShieldCheck, Menu, X, Phone, Truck, Percent, Sparkles, ArrowRight, Tag, Star } from 'lucide-react';
import { StoreSettings, User as UserType, Product } from '../types';

interface HeaderProps {
  settings: StoreSettings;
  cartCount: number;
  currentView: string;
  setCurrentView: (view: string) => void;
  openCart: () => void;
  user: UserType | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  currentView,
  setCurrentView,
  openCart,
  user,
  onOpenAuth,
  onLogout,
  searchQuery,
  setSearchQuery,
  products = [],
  onSelectProduct,
  onAddToCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop');
      setIsSearchOpen(false);
    }
  };

  // Close search auto-suggest popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live matching products
  const matchingProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const popularTags = ['Nakshi Kantha', 'Jute Handicrafts', 'Clay Pottery', 'Silk Saree', 'Brass Items', 'Wooden Crafts'];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-100">
      {/* Top Banner */}
      {settings.enableTopAnnouncementBar !== false && settings.bannerText && (
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-amber-300 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-amber-500/20">
          <Percent className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>{settings.bannerText}</span>
          <span className="hidden md:inline-block ml-4 text-slate-300 border-l border-slate-700 pl-4">
            <Phone className="w-3 h-3 inline mr-1 text-emerald-400" />
            Call Us: {settings.phone}
          </span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-hidden"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  {settings.storeName ? settings.storeName.charAt(0) : 'D'}
                </div>
              )}
              <div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {settings.storeName || 'Dana Shop'}
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-0.5">
                  Handicrafts & E-Commerce
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-700">
            <button
              onClick={() => setCurrentView('home')}
              className={`hover:text-emerald-600 transition-colors ${
                currentView === 'home' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('shop')}
              className={`hover:text-emerald-600 transition-colors ${
                currentView === 'shop' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setCurrentView('track-order')}
              className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${
                currentView === 'track-order' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              Track Order
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors border border-emerald-200"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Smart Search Bar with Auto-Suggest Overlay */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md items-center relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search products, handicrafts, clothing..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-sm rounded-full pl-10 pr-10 py-2.5 border border-transparent focus:border-emerald-500 focus:outline-hidden transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Smart Auto-Suggest Dropdown (Vectara Instant Search style) */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 divide-y divide-slate-100 animate-in fade-in duration-150">
                
                {/* Header Tag / Status */}
                <div className="bg-slate-50/80 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    Instant Smart Search
                  </span>
                  {searchQuery && (
                    <span>
                      {matchingProducts.length} match{matchingProducts.length !== 1 ? 'es' : ''} found
                    </span>
                  )}
                </div>

                {/* Popular Tags when search is empty */}
                {!searchQuery.trim() && (
                  <div className="p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400" /> Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {popularTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSearchQuery(tag);
                            setCurrentView('shop');
                            setIsSearchOpen(false);
                          }}
                          className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium transition-colors border border-slate-200/60"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results List */}
                {searchQuery.trim() && matchingProducts.length > 0 && (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 p-1">
                    {matchingProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(product);
                          setCurrentView('product-detail');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {product.category}
                              </span>
                              <span className="flex items-center text-[10px] text-amber-500 font-bold">
                                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                                {product.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <span className="block text-xs font-extrabold text-emerald-700">
                              {settings.currency}{product.price}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="block text-[10px] text-slate-400 line-through">
                                {settings.currency}{product.originalPrice}
                              </span>
                            )}
                          </div>
                          {onAddToCart && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product);
                              }}
                              className="bg-slate-900 hover:bg-emerald-600 text-white text-xs p-2 rounded-lg transition-colors shadow-xs"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results */}
                {searchQuery.trim() && matchingProducts.length === 0 && (
                  <div className="p-6 text-center text-slate-500">
                    <p className="text-xs font-semibold text-slate-700">No matching products found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try searching for Nakshi, Jute, Clay, or Silk</p>
                  </div>
                )}

                {/* Bottom Footer Action */}
                {searchQuery.trim() && (
                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      setIsSearchOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border-t border-slate-100"
                  >
                    View all search results in shop <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="block text-xs font-bold text-slate-800">{user.name}</span>
                  <span className="block text-[10px] text-slate-500 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors text-xs font-semibold"
                  title="Log out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors text-sm font-semibold"
                id="login-btn"
              >
                <User className="w-5 h-5 text-slate-600" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-full transition-all shadow-md shadow-slate-900/10 hover:shadow-emerald-600/20 active:scale-95"
              id="header-cart-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-sm rounded-full pl-10 pr-4 py-2 border border-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-medium text-slate-800 hover:text-emerald-600"
          >
            Home
          </button>
          <button
            onClick={() => {
              setCurrentView('shop');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-medium text-slate-800 hover:text-emerald-600"
          >
            All Products
          </button>
          <button
            onClick={() => {
              setCurrentView('track-order');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-medium text-slate-800 hover:text-emerald-600 flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            Track Order
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 font-semibold text-emerald-700 bg-emerald-50 rounded-lg px-3"
            >
              Admin Dashboard
            </button>
          )}
        </div>
      )}
    </header>
  );
};

