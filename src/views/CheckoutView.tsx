import React, { useState, useEffect } from 'react';
import { CartItem, StoreSettings, Order } from '../types';
import { ShieldCheck, Truck, CreditCard, ArrowLeft, CheckCircle2, Phone, MapPin, Tag } from 'lucide-react';
import bdDivisions from '../data/bd-divisions.json';
import bdDistricts from '../data/bd-districts.json';
import bdUpazilas from '../data/bd-upazilas.json';

interface CheckoutViewProps {
  cart: CartItem[];
  settings: StoreSettings;
  appliedCoupon: { code: string; discount: number } | null;
  onClearCart: () => void;
  onBackToShop: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  settings,
  appliedCoupon,
  onClearCart,
  onBackToShop,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Cash on Delivery'>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle cascading address state resets
  useEffect(() => {
    setSelectedDistrict('');
    setSelectedUpazila('');
  }, [selectedDivision]);

  useEffect(() => {
    setSelectedUpazila('');
  }, [selectedDistrict]);

  // Use the actual selected district data to determine delivery zone
  const activeDistrictData = bdDistricts.districts.find(d => d.id === selectedDistrict);
  const city = activeDistrictData?.name === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka';

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const deliveryFee =
    city === 'Inside Dhaka'
      ? settings.deliveryFeeInsideDhaka
      : settings.deliveryFeeOutsideDhaka;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedDivision || !selectedDistrict || !selectedUpazila || !address) {
      setErrorMsg('Please fill in all required customer and address details.');
      return;
    }

    const cleanPhone = customerPhone.trim().replace(/\s+/g, '');
    const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).');
      return;
    }

    if ((paymentMethod === 'bKash' || paymentMethod === 'Nagad') && !transactionId.trim()) {
      setErrorMsg(`Please enter the ${paymentMethod} transaction ID.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const divisionName = bdDivisions.divisions.find(d => d.id === selectedDivision)?.name || '';
    const districtName = bdDistricts.districts.find(d => d.id === selectedDistrict)?.name || '';
    const upazilaName = bdUpazilas.upazilas.find(u => u.id === selectedUpazila)?.name || '';
    const fullAddress = `${address}, ${upazilaName}, ${districtName}, ${divisionName} Division`;

    try {
      const orderPayload = {
        customerName,
        customerEmail: customerEmail || 'customer@danashop.com',
        customerPhone,
        address: fullAddress,
        city,
        items: cart.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          image: i.product.image,
          price: i.product.price,
          quantity: i.quantity,
        })),
        subtotal,
        discount,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        transactionId: paymentMethod !== 'Cash on Delivery' ? transactionId : undefined,
        paymentStatus: paymentMethod !== 'Cash on Delivery' ? 'Paid' : 'Pending',
        orderStatus: 'Pending',
        note,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const createdOrder: Order = await res.json();
        onClearCart();
        onOrderSuccess(createdOrder);
      } else {
        setErrorMsg('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToShop}
          className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Checkout Order</h1>
          <p className="text-xs text-slate-500">Complete your delivery and payment details</p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Customer Details & Payment (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Customer Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>1. Shipping & Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rafiqul Islam"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01700000000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="e.g. customer@gmail.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Delivery Location <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                    required
                  >
                    <option value="">Select Division...</option>
                    {bdDivisions.divisions.map(div => (
                      <option key={div.id} value={div.id}>{div.name} ({div.bn_name})</option>
                    ))}
                  </select>

                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedDivision}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 disabled:opacity-50"
                    required
                  >
                    <option value="">Select District...</option>
                    {bdDistricts.districts.filter(d => d.division_id === selectedDivision).map(dist => (
                      <option key={dist.id} value={dist.id}>{dist.name} ({dist.bn_name})</option>
                    ))}
                  </select>

                  <select
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 disabled:opacity-50"
                    required
                  >
                    <option value="">Select Upazila/Thana...</option>
                    {bdUpazilas.upazilas.filter(u => u.district_id === selectedDistrict).map(upz => (
                      <option key={upz.id} value={upz.id}>{upz.name} ({upz.bn_name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Street / House Address <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat #, Road #, Area or Village"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Instructions / Note</label>
              <input
                type="text"
                placeholder="e.g. Call before delivery or leave with security guard"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>2. Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* bKash Option */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'bKash'
                    ? 'border-pink-500 bg-pink-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-pink-600 text-sm">bKash</span>
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'bKash'}
                    onChange={() => setPaymentMethod('bKash')}
                    className="accent-pink-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Send Money to {settings.bkashNumber}</p>
              </label>

              {/* Nagad Option */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'Nagad'
                    ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-orange-600 text-sm">Nagad</span>
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'Nagad'}
                    onChange={() => setPaymentMethod('Nagad')}
                    className="accent-orange-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Send Money to {settings.nagadNumber}</p>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-800 text-sm">Cash on Delivery</span>
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Pay cash upon parcel arrival</p>
              </label>
            </div>

            {/* Payment Instructions for bKash / Nagad */}
            {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 text-xs">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  {paymentMethod} Payment Instructions:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>Go to your {paymentMethod} App or Dial *247# / *167#</li>
                  <li>Choose <strong>Send Money</strong> option</li>
                  <li>Enter Number: <strong className="text-white font-mono">{paymentMethod === 'bKash' ? settings.bkashNumber : settings.nagadNumber}</strong></li>
                  <li>Enter Amount: <strong className="text-emerald-400 font-mono">{settings.currency}{grandTotal.toLocaleString()}</strong></li>
                  <li>Copy and paste the Transaction ID below</li>
                </ol>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {paymentMethod} Transaction ID (TrxID) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BK9X128A40"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-xs text-amber-300 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 uppercase"
                  />
                </div>
              </div>
            )}

          </div>

          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 border border-rose-200 p-4 rounded-xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

        </div>

        {/* Right Column: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 sticky top-28">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">
              Order Summary ({cart.length} items)
            </h2>

            {/* Cart Items List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-xs items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-slate-500">Qty: {item.quantity} × {settings.currency}{item.product.price}</p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {settings.currency}{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">{settings.currency}{subtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-{settings.currency}{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee ({city})</span>
                <span className="font-bold text-slate-800">{settings.currency}{deliveryFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-emerald-600 text-lg">{settings.currency}{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-98"
              id="confirm-place-order-btn"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm Order'}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe SSL Encrypted Checkout
            </p>
          </div>
        </div>

      </form>

    </div>
  );
};
