import React, { useState } from 'react';
import { MessageSquare, X, Send, PhoneCall } from 'lucide-react';
import { StoreSettings } from '../types';

interface WhatsAppWidgetProps {
  settings: StoreSettings;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  if (settings.enableWhatsAppWidget === false) {
    return null;
  }

  const rawPhone = settings.whatsappNumber || settings.phone;
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim() || `Hello! I have an inquiry regarding ${settings.storeName || 'Dana Shop'} products.`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Widget Card */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
          {/* Card Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Dana Shop Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Usually replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50 space-y-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-slate-700">
              👋 Assalamu Alaikum! Welcome to Dana Shop. How can we assist you today?
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-2 pt-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message or question..."
                rows={3}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </button>
            </form>

            <div className="pt-2 text-center">
              <a
                href={`tel:${settings.phone}`}
                className="text-[11px] font-semibold text-slate-600 hover:text-emerald-600 inline-flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3 text-emerald-600" /> Call Hotline: {settings.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-xl shadow-emerald-600/30 transition-transform active:scale-90 flex items-center gap-2 font-semibold text-xs"
        id="whatsapp-widget-btn"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="hidden sm:inline font-bold">Customer Support</span>
      </button>
    </div>
  );
};
