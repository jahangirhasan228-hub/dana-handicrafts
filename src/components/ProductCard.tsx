import React from 'react';
import { Product, StoreSettings } from '../types';
import { Star, ShoppingBag, Eye, Percent, ShieldCheck, Leaf, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onSelectProduct,
  onAddToCart,
}) => {
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden relative">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Percent className="w-3 h-3" />
            {discountPercent}% OFF
          </span>
        )}
        {product.isHalalCertified && settings.enableHalalBadges !== false && (
          <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-emerald-300" /> 100% Halal Crafts
          </span>
        )}
        {product.isEcoFriendly && settings.enableEcoBadges !== false && (
          <span className="bg-teal-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs uppercase tracking-wider">
            <Leaf className="w-3 h-3 text-teal-200" /> Eco-Handmade
          </span>
        )}
        {product.featured && (
          <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs">
            Featured
          </span>
        )}
      </div>

      {/* Product Image */}
      <div
        onClick={() => onSelectProduct(product)}
        className="aspect-square bg-slate-100 relative overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-xs text-slate-900 font-semibold text-xs px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-600" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              {product.category}
            </span>
            {product.artisanOrigin && settings.enableArtisanOrigin !== false && (
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 flex items-center gap-0.5 shrink-0">
                <MapPin className="w-2.5 h-2.5 text-amber-600" />
                {product.artisanOrigin}
              </span>
            )}
          </div>
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-emerald-600 transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between gap-1 text-xs text-slate-500">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="ml-1 font-bold text-slate-800">{product.rating}</span>
            <span className="ml-1 text-slate-400">({product.reviewCount})</span>
          </div>

          {settings.enableStockBadges !== false && (
            <div className="text-[10px] font-bold">
              {product.stock <= 0 ? (
                <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">Only {product.stock} left</span>
              ) : (
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">In Stock ({product.stock})</span>
              )}
            </div>
          )}
        </div>

        {/* Price & Cart CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-lg font-extrabold text-slate-900 tracking-tight">
              {settings.currency}{product.price.toLocaleString()}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-slate-400 line-through">
                {settings.currency}{product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="p-2.5 sm:px-3.5 sm:py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 font-semibold text-xs"
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

      </div>
    </div>
  );
};
