import React, { useState, useEffect } from 'react';
import { Product, Category, CartItem, StoreSettings, User as UserType, Order } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { TrackOrderView } from './views/TrackOrderView';
import { AdminView } from './views/AdminView';
import { X, UserCheck, Shield, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home'); // home, shop, product-detail, checkout, track-order, admin
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('admin@danashop.com');
  const [authPassword, setAuthPassword] = useState<string>('admin123');
  const [authError, setAuthError] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Dana Shop',
    phone: '+880 1712-345678',
    email: 'support@danashop.com',
    currency: '৳',
    bannerText: '⚡ Special Offer: Get 10% OFF with code DANA10! Fast Delivery Across Bangladesh.',
    bkashNumber: '01712345678',
    nagadNumber: '01812345678',
    deliveryFeeInsideDhaka: 60,
    deliveryFeeOutsideDhaka: 120,
    noticeMsg: 'Free delivery on orders over ৳3,000!',
  });

  useEffect(() => {
    fetchSettings();
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) setSettings(await res.json());
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleApplyCoupon = async (code: string) => {
    const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ code: code.toUpperCase(), discount: data.discount });
        return { success: true, message: `Coupon ${code.toUpperCase()} applied (-${settings.currency}${data.discount})!` };
      }
      return { success: false, message: data.message || 'Invalid coupon' };
    } catch (err) {
      return { success: false, message: 'Server error validating coupon' };
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAuthModalOpen(false);
        if (data.user.role === 'admin') {
          setCurrentView('admin');
        }
      } else {
        setAuthError('Invalid email or password. Use admin@danashop.com / admin123 for admin demo.');
      }
    } catch (err) {
      setAuthError('Error logging in.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Header */}
      <Header
        settings={settings}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openCart={() => setCartOpen(true)}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => setUser(null)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={products}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setCurrentView('product-detail');
        }}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            categories={categories}
            settings={settings}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentView('product-detail');
            }}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            setCurrentView={setCurrentView}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            categories={categories}
            settings={settings}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentView('product-detail');
            }}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            settings={settings}
            onAddToCart={(p, qty) => handleAddToCart(p, qty)}
            onBack={() => setCurrentView('shop')}
            allProducts={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cart={cart}
            settings={settings}
            appliedCoupon={appliedCoupon}
            onClearCart={() => setCart([])}
            onBackToShop={() => setCurrentView('shop')}
            onOrderSuccess={(ord) => {
              setConfirmedOrder(ord);
            }}
          />
        )}

        {currentView === 'track-order' && (
          <TrackOrderView settings={settings} />
        )}

        {currentView === 'admin' && (
          <AdminView settings={settings} onRefreshSettings={fetchSettings} />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        settings={settings}
        onProceedToCheckout={() => setCurrentView('checkout')}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
      />

      {/* Floating WhatsApp Support Widget */}
      <WhatsAppWidget settings={settings} />

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-slate-200">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sign In to Dana Shop</h3>
              <p className="text-xs text-slate-500">Demo Admin credentials pre-filled below</p>
            </div>

            {authError && (
              <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-semibold">
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-xs"
              >
                Sign In
              </button>
            </form>

            <div className="pt-2 text-center text-slate-400 text-[11px] border-t border-slate-100 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Admin Demo: admin@danashop.com / admin123
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 space-y-6 text-center border border-slate-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Order Confirmed!</h2>
              <p className="text-xs text-slate-500 mt-1">Thank you for shopping with Dana Shop.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Number:</span>
                <span className="font-mono font-bold text-emerald-600">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-bold">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-extrabold text-slate-900">{settings.currency}{confirmedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Save your Tracking Number <strong className="text-slate-900 font-mono">{confirmedOrder.trackingNumber}</strong> to track delivery status anytime.
            </p>

            <button
              onClick={() => {
                setConfirmedOrder(null);
                setCurrentView('track-order');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors text-xs"
            >
              Track Order Status Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
