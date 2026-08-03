import React from 'react';
import { StoreSettings } from '../types';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, CreditCard, Headset } from 'lucide-react';
import { SocialIcons } from './SocialIcons';

interface FooterProps {
  settings: StoreSettings;
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setCurrentView }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Trust Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800 mb-12">
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Fast Delivery</h4>
              <p className="text-xs text-slate-400">24-48 Hours across Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Authentic</h4>
              <p className="text-xs text-slate-400">Guaranteed genuine products</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">bKash / Nagad / COD</h4>
              <p className="text-xs text-slate-400">Safe manual & cash payment</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Easy Returns</h4>
              <p className="text-xs text-slate-400">7 Days replacement policy</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                  {settings.storeName ? settings.storeName.charAt(0) : 'D'}
                </div>
              )}
              <span className="text-xl font-extrabold text-white tracking-tight">
                {settings.storeName || 'Dana Shop'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.siteDescription || 'Your trusted online destination in Bangladesh for premium electronics, fashion, beauty, and home essentials.'}
            </p>

            <div className="text-xs text-slate-400 space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mobile: {settings.phone}</span>
              </div>
              {settings.hotline && (
                <div className="flex items-center gap-2">
                  <Headset className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hotline: {settings.hotline}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address || 'Gulshan-1, Dhaka-1212, Bangladesh'}</span>
              </div>
            </div>

            {/* Social Media Links Section */}
            <div className="pt-3">
              <span className="text-[11px] font-bold text-slate-300 block mb-2 uppercase tracking-wider">Follow Us On Social Media</span>
              <SocialIcons settings={settings} showLabels={false} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-emerald-400 transition-colors">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-emerald-400 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('track-order')} className="hover:text-emerald-400 transition-colors">
                  Track Order Status
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="hover:text-emerald-400 transition-colors">
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Accepted Payments</h3>
            <p className="text-xs text-slate-400 mb-3">
              We support Cash on Delivery as well as direct mobile transfers:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center">
                <span className="font-bold text-pink-400">bKash Personal:</span>
                <span className="font-mono text-slate-200">{settings.bkashNumber}</span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center">
                <span className="font-bold text-orange-400">Nagad Personal:</span>
                <span className="font-mono text-slate-200">{settings.nagadNumber}</span>
              </div>
            </div>
          </div>

          {/* Delivery Rates */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Delivery Charges</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>Inside Dhaka City:</span>
                <span className="font-bold text-emerald-400">{settings.currency}{settings.deliveryFeeInsideDhaka}</span>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>Outside Dhaka:</span>
                <span className="font-bold text-emerald-400">{settings.currency}{settings.deliveryFeeOutsideDhaka}</span>
              </p>
              <p className="text-[11px] text-amber-400/90 pt-1 font-medium">
                {settings.noticeMsg}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p className="text-slate-600">Built with precision for seamless online shopping.</p>
        </div>

      </div>
    </footer>
  );
};
