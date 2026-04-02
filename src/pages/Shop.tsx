import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { apiService } from '../services/apiService';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Anime', 'Coding', 'Memes', 'Quotes', 'Aesthetic'];

  useEffect(() => {
    const loadData = async () => {
      const data = await apiService.getProducts();
      setProducts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
      });
  }, [search, category, sortBy, products]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">The Sticker Shop</h1>
          <p className="text-white/50">Browse our collection of {products.length} premium stickers.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          <input 
            type="text" 
            placeholder="Search stickers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-10">
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-white/40 mb-6 flex items-center gap-2">
              <Filter size={14} /> Categories
            </h4>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                    category === cat ? 'bg-brand-primary text-white' : 'glass hover:bg-white/10 text-white/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-white/40 mb-6 flex items-center gap-2">
              <SlidersHorizontal size={14} /> Sort By
            </h4>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center glass rounded-3xl text-center p-12">
              <Search size={48} className="text-white/20 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No stickers found</h3>
              <p className="text-white/50">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {setSearch(''); setCategory('All');}}
                className="mt-6 text-brand-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
