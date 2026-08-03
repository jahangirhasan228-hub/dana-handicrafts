import React, { useState, useEffect } from 'react';
import { Product, Review, StoreSettings } from '../types';
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw, Plus, Minus, Send, Check } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailViewProps {
  product: Product;
  settings: StoreSettings;
  onAddToCart: (p: Product, quantity?: number) => void;
  onBack: () => void;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  settings,
  onAddToCart,
  onBack,
  allProducts,
  onSelectProduct,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${product.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: newReview.userName,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });
      if (res.ok) {
        setReviewSubmitted(true);
        setNewReview({ userName: '', rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </button>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
        
        {/* Left: Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 font-extrabold text-slate-800 text-sm">{product.rating}</span>
              </div>
              <span>•</span>
              <span>{reviews.length || product.reviewCount} verified customer reviews</span>
              <span>•</span>
              <span className={product.stock > 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {settings.currency}{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
                {settings.currency}{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

          {/* Halal & Eco & Heritage Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <p className="font-extrabold text-xs text-emerald-950">100% Halal & Ethical Materials</p>
                <p className="text-[10px] text-emerald-700 font-medium">Pure non-prohibited, ethically sourced elements</p>
              </div>
            </div>

            <div className="bg-teal-50/80 border border-teal-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <RefreshCw className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <p className="font-extrabold text-xs text-teal-950">Eco-Friendly Artisan Craft</p>
                <p className="text-[10px] text-teal-700 font-medium">Biodegradable jute & handloom heritage</p>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-700 uppercase tracking-wider">
                Specifications
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="p-3 flex justify-between bg-white">
                    <span className="font-semibold text-slate-500">{key}:</span>
                    <span className="font-bold text-slate-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 font-extrabold text-sm text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={() => onAddToCart(product, quantity)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
              id="add-to-cart-detail-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add {quantity} to Cart ({settings.currency}{(product.price * quantity).toLocaleString()})</span>
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fast Home Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>bKash / COD Pay</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-500 shrink-0" />
              <span>7 Days Return</span>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Customer Reviews ({reviews.length})</h2>
          <div className="flex items-center text-amber-400 font-bold text-sm">
            <Star className="w-4 h-4 fill-amber-400 mr-1" />
            <span>{product.rating} out of 5</span>
          </div>
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">{r.userName}</span>
                  <span className="text-[10px] text-slate-400">{r.date}</span>
                </div>
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Review Form */}
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Write a Customer Review</h3>
          {reviewSubmitted ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your review has been submitted successfully.</span>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahfuz Ahmed"
                    value={newReview.userName}
                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Review Comment</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share your experience with this item..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                settings={settings}
                onSelectProduct={onSelectProduct}
                onAddToCart={(p) => onAddToCart(p, 1)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
