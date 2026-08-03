import React, { useState } from 'react';
import { Product, Category, StoreSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, Search, X, ShieldCheck, Leaf } from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  settings,
  onSelectProduct,
  onAddToCart,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [filterHalalOnly, setFilterHalalOnly] = useState(false);
  const [filterEcoOnly, setFilterEcoOnly] = useState(false);

  // Filter products
  let filtered = products.filter((p) => {
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHalal = !filterHalalOnly || p.isHalalCertified;
    const matchesEco = !filterEcoOnly || p.isEcoFriendly;

    return matchesCategory && matchesSearch && matchesHalal && matchesEco;
  });

  // Sort
  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'All Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filtered.length} products available for delivery
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" /> Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
          >
            <option value="default">Featured & Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Active Search Tag */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            !selectedCategory || selectedCategory === 'All'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat.name
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}

        {/* Halal Certified & Eco Badges Quick Filter */}
        <button
          onClick={() => setFilterHalalOnly(!filterHalalOnly)}
          className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
            filterHalalOnly
              ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400/40'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Halal Crafts</span>
        </button>

        <button
          onClick={() => setFilterEcoOnly(!filterEcoOnly)}
          className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
            filterEcoOnly
              ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-400/40'
              : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Eco Handmade</span>
        </button>

        {searchQuery && (
          <div className="ml-auto bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
            <span>Query: "{searchQuery}"</span>
            <button onClick={() => setSearchQuery('')} className="hover:text-rose-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No products match your criteria</h3>
          <p className="text-xs text-slate-500">Try adjusting your category filter or search query.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

    </div>
  );
};
