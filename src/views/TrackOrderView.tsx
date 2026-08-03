import React, { useState } from 'react';
import { Order, StoreSettings } from '../types';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, Package, AlertCircle } from 'lucide-react';

interface TrackOrderViewProps {
  settings: StoreSettings;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({ settings }) => {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setOrder(null);
        setError('Order not found. Please check your Tracking Number or Order ID.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'Pending', label: 'Order Placed', icon: Clock },
    { key: 'Processing', label: 'Processing', icon: Package },
    { key: 'Shipped', label: 'Shipped Out', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: PackageCheck },
  ];

  const getStepIndex = (status: Order['orderStatus']) => {
    if (status === 'Cancelled') return -1;
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Your Parcel Status</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Tracking Number (e.g. <strong className="text-slate-800">DNS-849201</strong>) or Order ID to check real-time progress.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="e.g. DNS-849201 or ord-1001"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {/* Results */}
      {error && (
        <div className="bg-rose-50 text-rose-700 border border-rose-200 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 animate-fade-in">
          
          {/* Top Order Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking ID:</span>
                <span className="font-mono text-sm font-extrabold text-emerald-600">{order.trackingNumber}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status:</span>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-200">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline Visual Indicator */}
          {order.orderStatus !== 'Cancelled' ? (
            <div className="py-6">
              <div className="grid grid-cols-4 gap-2 relative">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.orderStatus);
                  const isPassed = idx <= currentIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          isPassed
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-xs font-bold text-center">
              This order has been cancelled. Please contact customer support.
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <div className="space-y-1.5">
              <p className="font-bold text-slate-900">Customer Details:</p>
              <p>Name: {order.customerName}</p>
              <p>Phone: {order.customerPhone}</p>
              <p>Address: {order.address}, {order.city}</p>
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-slate-900">Payment Summary:</p>
              <p>Method: {order.paymentMethod}</p>
              {order.transactionId && <p>TrxID: <span className="font-mono text-emerald-700 font-bold">{order.transactionId}</span></p>}
              <p>Payment Status: <span className="font-bold text-slate-800">{order.paymentStatus}</span></p>
              <p className="font-extrabold text-slate-900 text-sm pt-1">Total: {settings.currency}{order.total.toLocaleString()}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <p className="font-bold text-xs text-slate-900">Ordered Items:</p>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                    <span className="font-medium text-slate-800">{item.productName}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.quantity} × {settings.currency}{item.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
