import React, { useState, useEffect } from 'react';
import { Product, Category, Coupon, Order, StoreSettings } from '../types';
import { ShieldCheck, Package, ShoppingBag, Settings, DollarSign, Plus, Trash2, Edit3, Save, RefreshCw, CheckCircle, Printer, FileText, X, Truck, Phone, MapPin } from 'lucide-react';

interface AdminViewProps {
  settings: StoreSettings;
  onRefreshSettings: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ settings, onRefreshSettings }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'coupons' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Form states for new product
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Electronics & Gadgets',
    price: 1000,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: '',
    stock: 20,
    featured: false,
  });

  // Settings form state
  const [storeForm, setStoreForm] = useState({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setStoreForm({ ...settings });
  }, [settings]);

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const res = await fetch('/api/orders');
        if (res.ok) setOrders(await res.json());
      } else if (activeTab === 'products') {
        const res = await fetch('/api/products');
        if (res.ok) setProducts(await res.json());
      } else if (activeTab === 'categories') {
        const res = await fetch('/api/categories');
        if (res.ok) setCategories(await res.json());
      } else if (activeTab === 'coupons') {
        const res = await fetch('/api/coupons');
        if (res.ok) setCoupons(await res.json());
      } else if (activeTab === 'settings') {
        const resProd = await fetch('/api/products');
        if (resProd.ok) setProducts(await resProd.json());
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProd,
          rating: 5.0,
          reviewCount: 0,
        }),
      });
      if (res.ok) {
        setNewProd({
          name: '',
          category: 'Electronics & Gadgets',
          price: 1000,
          originalPrice: 1200,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          description: '',
          stock: 20,
          featured: false,
        });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeForm),
      });
      if (res.ok) {
        setSettingsSaved(true);
        onRefreshSettings();
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Dana Shop Admin Dashboard</h1>
            <p className="text-xs text-slate-400">Manage orders, product catalog, coupons & store configuration</p>
          </div>
        </div>

        <button
          onClick={loadAdminData}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'coupons', label: 'Coupons & Promos', icon: DollarSign },
          { id: 'settings', label: 'Store Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs font-bold">Loading admin management panel...</div>
      ) : (
        <>
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
              <h2 className="text-lg font-bold text-slate-900">Manage Orders ({orders.length})</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Order ID / Trx</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">{o.id}</span>
                          <span className="block text-[10px] font-mono text-emerald-600">{o.trackingNumber}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900">{o.customerName}</span>
                          <span className="block text-[10px] text-slate-500">{o.customerPhone}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold">{o.paymentMethod}</span>
                          {o.transactionId && <span className="block text-[10px] font-mono text-pink-600">{o.transactionId}</span>}
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          {settings.currency}{o.total.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            o.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                              className="bg-white border border-slate-300 rounded-lg p-1 text-[11px] font-bold"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                              onClick={() => setSelectedInvoiceOrder(o)}
                              className="bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Print Invoice / Packing Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Invoice</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              {/* Add Product Form */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <span>Add New Product to Store</span>
                </h2>

                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wireless Smart Earbuds"
                      value={newProd.name}
                      onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    >
                      <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Beauty & Skincare">Beauty & Skincare</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sale Price ({settings.currency})</label>
                    <input
                      type="number"
                      required
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Original Price ({settings.currency})</label>
                    <input
                      type="number"
                      value={newProd.originalPrice}
                      onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={newProd.image}
                      onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief product description..."
                      value={newProd.description}
                      onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="sm:col-span-2 lg:col-span-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                  >
                    Add Product to Catalog
                  </button>
                </form>
              </div>

              {/* Product List */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Current Catalog ({products.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="p-3 border border-slate-200 rounded-2xl flex gap-3 items-center bg-slate-50">
                      <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
                        <p className="text-emerald-700 font-extrabold">{settings.currency}{p.price}</p>
                        <p className="text-slate-400 text-[10px]">Stock: {p.stock}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-rose-500 hover:text-rose-700 p-2"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Active Coupons & Promo Codes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-sm text-emerald-700">{c.code}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Flat ${settings.currency}${c.discountValue}`}
                      </span>
                    </div>
                    <p className="text-slate-500">Min Purchase: {settings.currency}{c.minPurchase}</p>
                    <p className="text-slate-400 text-[10px]">Expires: {c.expiryDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-emerald-600" />
                    <span>Dynamic Site & Admin Configuration</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage site identity, logo, social links, top 10 TV deals, ad banners, and payment info.
                  </p>
                </div>
              </div>

              {settingsSaved && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Site configuration successfully saved & updated across all pages live!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-8 text-xs">
                
                {/* 1. BRANDING & LOGO */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Site Name, Logo & Description
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Store / Site Name</label>
                      <input
                        type="text"
                        value={storeForm.storeName || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                        placeholder="e.g. Dana Handicrafts & Shop"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Site Logo URL</label>
                      <input
                        type="text"
                        value={storeForm.logoUrl || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, logoUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/your-logo.jpg"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Site Description</label>
                      <textarea
                        rows={2}
                        value={storeForm.siteDescription || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, siteDescription: e.target.value })}
                        placeholder="Your trusted online store in Bangladesh for authentic products..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONTACT INFO & NUMBERS */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Phone Numbers, Email & Office Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Primary Phone Number</label>
                      <input
                        type="text"
                        value={storeForm.phone || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={storeForm.whatsappNumber || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hotline / Emergency</label>
                      <input
                        type="text"
                        value={storeForm.hotline || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, hotline: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={storeForm.email || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Physical Office Address</label>
                      <input
                        type="text"
                        value={storeForm.address || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                        placeholder="House 14, Road 7, Gulshan-1, Dhaka-1212"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. OFFICIAL SOCIAL MEDIA LINKS */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Official Social Media Channels (Auto-renders Official Logos)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Facebook Page URL</label>
                      <input
                        type="text"
                        value={storeForm.facebookUrl || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/yourpage"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Instagram Profile URL</label>
                      <input
                        type="text"
                        value={storeForm.instagramUrl || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">YouTube Channel URL</label>
                      <input
                        type="text"
                        value={storeForm.youtubeUrl || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/@yourchannel"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp Direct Chat Link</label>
                      <input
                        type="text"
                        value={storeForm.whatsappUrl || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, whatsappUrl: e.target.value })}
                        placeholder="https://wa.me/8801712345678"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">TikTok Profile URL</label>
                      <input
                        type="text"
                        value={storeForm.tiktokUrl || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, tiktokUrl: e.target.value })}
                        placeholder="https://tiktok.com/@yourhandle"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Twitter / X Profile URL</label>
                      <input
                        type="text"
                        value={storeForm.twitterUrl || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, twitterUrl: e.target.value })}
                        placeholder="https://twitter.com/yourhandle"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. TOP 10 TV BANNER CONFIGURATION */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      📺 Top 10 Products TV Banner Showcase
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={!!storeForm.showTvBanner}
                        onChange={(e) => setStoreForm({ ...storeForm, showTvBanner: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Enable TV Banner</span>
                    </label>
                  </div>

                  {storeForm.showTvBanner && (
                    <div className="space-y-4 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">TV Banner Headline Title</label>
                          <input
                            type="text"
                            value={storeForm.tvBannerTitle || ''}
                            onChange={(e) => setStoreForm({ ...storeForm, tvBannerTitle: e.target.value })}
                            placeholder="LIVE TV MEGA DEALS - TOP 10 SPECIAL OFFERS"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">TV Banner Subtitle / Broadcast Msg</label>
                          <input
                            type="text"
                            value={storeForm.tvBannerSubtitle || ''}
                            onChange={(e) => setStoreForm({ ...storeForm, tvBannerSubtitle: e.target.value })}
                            placeholder="Exclusive broadcast discounts updated live!"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-2">
                          Select Top Products to Feature in TV Banner (Check up to 10):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-white border border-slate-200 rounded-xl">
                          {products.map((p) => {
                            const isSelected = (storeForm.tvBannerProductIds || []).includes(p.id);
                            return (
                              <label key={p.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const currentList = storeForm.tvBannerProductIds || [];
                                    if (e.target.checked) {
                                      setStoreForm({
                                        ...storeForm,
                                        tvBannerProductIds: [...currentList, p.id],
                                      });
                                    } else {
                                      setStoreForm({
                                        ...storeForm,
                                        tvBannerProductIds: currentList.filter((id) => id !== p.id),
                                      });
                                    }
                                  }}
                                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                                />
                                <span className="text-xs text-slate-800 font-medium truncate">{p.name} ({settings.currency}{p.price})</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. DYNAMIC ADS CONFIGURATION */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      📢 Dynamic Ads Management (Banner Ads & Google/Third-Party Ad Code)
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={!!storeForm.showAds}
                        onChange={(e) => setStoreForm({ ...storeForm, showAds: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Enable Ads Display</span>
                    </label>
                  </div>

                  {storeForm.showAds && (
                    <div className="space-y-6 pt-1">
                      
                      {/* Top Ad */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="font-bold text-slate-800 text-xs text-emerald-700">Top Header Ad Banner</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ad Image URL</label>
                            <input
                              type="text"
                              value={storeForm.topBannerAdImageUrl || ''}
                              onChange={(e) => setStoreForm({ ...storeForm, topBannerAdImageUrl: e.target.value })}
                              placeholder="https://images.unsplash.com/ad-banner.jpg"
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Click Link URL</label>
                            <input
                              type="text"
                              value={storeForm.topBannerAdLink || ''}
                              onChange={(e) => setStoreForm({ ...storeForm, topBannerAdLink: e.target.value })}
                              placeholder="https://danashop.com/special-offer"
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Large Footer Ad */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="font-bold text-slate-800 text-xs text-amber-700">Large Bottom Ad Banner</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Large Ad Image URL</label>
                            <input
                              type="text"
                              value={storeForm.largeAdImageUrl || ''}
                              onChange={(e) => setStoreForm({ ...storeForm, largeAdImageUrl: e.target.value })}
                              placeholder="https://images.unsplash.com/large-ad.jpg"
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Click Link URL</label>
                            <input
                              type="text"
                              value={storeForm.largeAdLink || ''}
                              onChange={(e) => setStoreForm({ ...storeForm, largeAdLink: e.target.value })}
                              placeholder="https://danashop.com/deals"
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* 6. PAYMENT, FEES & BANNER ANNOUNCEMENT */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Payment Accounts, Delivery Charges & Announcement Text
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
                      <input
                        type="text"
                        value={storeForm.currency || '৳'}
                        onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">bKash Personal Number</label>
                      <input
                        type="text"
                        value={storeForm.bkashNumber || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, bkashNumber: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nagad Personal Number</label>
                      <input
                        type="text"
                        value={storeForm.nagadNumber || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, nagadNumber: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Inside Dhaka Delivery Fee</label>
                      <input
                        type="number"
                        value={storeForm.deliveryFeeInsideDhaka}
                        onChange={(e) => setStoreForm({ ...storeForm, deliveryFeeInsideDhaka: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Outside Dhaka Delivery Fee</label>
                      <input
                        type="number"
                        value={storeForm.deliveryFeeOutsideDhaka}
                        onChange={(e) => setStoreForm({ ...storeForm, deliveryFeeOutsideDhaka: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block font-semibold text-slate-700 mb-1">Top Announcement Banner Text</label>
                      <input
                        type="text"
                        value={storeForm.bannerText || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, bannerText: e.target.value })}
                        placeholder="⚡ Special Offer: Get 10% OFF with code DANA10! Fast Delivery Across Bangladesh."
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. A-TO-Z FEATURE CONTROL PANEL (ON/OFF TOGGLES) */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    ⚡ Master Feature Control Panel (Dynamic Enable/Disable Switches)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    
                    <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                      <div>
                        <p className="font-bold text-xs text-slate-900">Top Announcement Ticker Bar</p>
                        <p className="text-[10px] text-slate-500">Show top promo notice text across site</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={storeForm.enableTopAnnouncementBar !== false}
                        onChange={(e) => setStoreForm({ ...storeForm, enableTopAnnouncementBar: e.target.checked })}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                      <div>
                        <p className="font-bold text-xs text-slate-900">Instant Smart Search Auto-Suggest</p>
                        <p className="text-[10px] text-slate-500">Live search popover with image & price</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={storeForm.enableInstantSearch !== false}
                        onChange={(e) => setStoreForm({ ...storeForm, enableInstantSearch: e.target.checked })}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                      <div>
                        <p className="font-bold text-xs text-slate-900">Floating WhatsApp Chat Widget</p>
                        <p className="text-[10px] text-slate-500">Live bottom-right customer support button</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={storeForm.enableWhatsAppWidget !== false}
                        onChange={(e) => setStoreForm({ ...storeForm, enableWhatsAppWidget: e.target.checked })}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                      <div>
                        <p className="font-bold text-xs text-slate-900">100% Halal Crafts Badges</p>
                        <p className="text-[10px] text-slate-500">Ethical & halal product tags on cards</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={storeForm.enableHalalBadges !== false}
                        onChange={(e) => setStoreForm({ ...storeForm, enableHalalBadges: e.target.checked })}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                      <div>
                        <p className="font-bold text-xs text-slate-900">Eco Handmade Craft Badges</p>
                        <p className="text-[10px] text-slate-500">Show eco-friendly jute & handloom tags</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={storeForm.enableEcoBadges !== false}
                        onChange={(e) => setStoreForm({ ...storeForm, enableEcoBadges: e.target.checked })}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                      <div>
                        <p className="font-bold text-xs text-slate-900">Artisan Regional Origin Tags</p>
                        <p className="text-[10px] text-slate-500">Display district origin (Rajshahi, etc.)</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={storeForm.enableArtisanOrigin !== false}
                        onChange={(e) => setStoreForm({ ...storeForm, enableArtisanOrigin: e.target.checked })}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                      <div>
                        <p className="font-bold text-xs text-slate-900">Real-time Stock Level Badges</p>
                        <p className="text-[10px] text-slate-500">Show In-Stock / Low Stock quantity alerts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={storeForm.enableStockBadges !== false}
                        onChange={(e) => setStoreForm({ ...storeForm, enableStockBadges: e.target.checked })}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 text-sm active:scale-98 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Save All Configurations Live</span>
                </button>

              </form>
            </div>
          )}
        </>
      )}

      {/* PRINTABLE INVOICE & COURIER PACKING SLIP MODAL */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-slate-800 my-8">
            
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Customer Invoice & Courier Packing Memo</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice / Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet Area */}
            <div className="p-2 space-y-6 text-xs" id="printable-invoice">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {settings.siteLogo ? (
                      <img src={settings.siteLogo} alt={settings.siteName} className="h-9 object-contain" />
                    ) : (
                      <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg">
                        {settings.siteName.charAt(0)}
                      </div>
                    )}
                    <span className="text-xl font-black text-slate-900 tracking-tight">{settings.siteName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {settings.contactPhone} | {settings.contactEmail}
                  </p>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> {settings.contactAddress}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="inline-block bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase mb-1">
                    OFFICIAL INVOICE
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm mt-1">Order ID: #{selectedInvoiceOrder.id}</p>
                  <p className="font-mono text-emerald-700 font-bold text-xs">Tracking #: {selectedInvoiceOrder.trackingNumber}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">CUSTOMER & BILL TO</p>
                  <p className="font-bold text-slate-900 text-sm">{selectedInvoiceOrder.customerName}</p>
                  <p className="text-slate-700 font-medium">{selectedInvoiceOrder.customerPhone}</p>
                  <p className="text-slate-600 text-[11px]">{selectedInvoiceOrder.customerEmail || 'No Email Provided'}</p>
                </div>

                <div>
                  <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">DELIVERY ADDRESS & PAYMENT</p>
                  <p className="font-bold text-slate-900 leading-snug">{selectedInvoiceOrder.address}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 bg-slate-200 px-2 py-0.5 rounded text-[10px]">
                      {selectedInvoiceOrder.paymentMethod}
                    </span>
                    {selectedInvoiceOrder.transactionId && (
                      <span className="font-mono font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded text-[10px]">
                        TrxID: {selectedInvoiceOrder.transactionId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-800 font-bold text-[10px] uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">Unit Price</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedInvoiceOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 flex items-center gap-2.5">
                          <img src={item.image} alt={item.productName} className="w-8 h-8 rounded border border-slate-200 object-cover" />
                          <span className="font-bold text-slate-900">{item.productName}</span>
                        </td>
                        <td className="p-3 text-center">{settings.currency}{item.price}</td>
                        <td className="p-3 text-center font-bold">{item.quantity}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{settings.currency}{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 max-w-xs w-full">
                  <p className="font-bold text-emerald-900 text-[11px] flex items-center gap-1.5 mb-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" /> Courier Parcel Note
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-snug">
                    Deliver to customer address via local courier service (Steadfast/RedX/Pathao). Collect Total Amount on delivery if Cash on Delivery.
                  </p>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-right font-medium">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">{settings.currency}{selectedInvoiceOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedInvoiceOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount Coupon:</span>
                      <span>-{settings.currency}{selectedInvoiceOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge ({selectedInvoiceOrder.city}):</span>
                    <span className="font-bold text-slate-900">{settings.currency}{selectedInvoiceOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900 text-base">
                    <span>Grand Total:</span>
                    <span className="text-emerald-700">{settings.currency}{selectedInvoiceOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Authorized Sign Footer */}
              <div className="pt-8 flex justify-between items-end text-[10px] text-slate-500 border-t border-slate-200">
                <div>
                  <p className="font-bold text-slate-800">Thank you for shopping with {settings.siteName}!</p>
                  <p>Computer generated invoice. No physical signature required.</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 w-32 mb-1"></div>
                  <p className="font-bold text-slate-700">Authorized Signature</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
