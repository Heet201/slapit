import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Zap } from 'lucide-react';
import { apiService } from '../services/apiService';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories()
        ]);
        setProducts(productsData);
        setCategories(['All', ...categoriesData.map((c: any) => c.name)]);
        
        const params = new URLSearchParams(location.search);
        const catParam = params.get('category');
        if (catParam) {
          setCategory(catParam);
        }
      } catch (error) {
        console.error("Error loading shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [location.search]);

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
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-brand-primary/20 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-brand-primary border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_20px_rgba(242,125,38,0.3)]"></div>
          <Zap size={24} className="absolute inset-0 m-auto text-brand-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-10 mb-12 sm:mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Marketplace</span>
              <div className="h-px w-8 sm:w-12 bg-brand-primary/30" />
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase text-glow leading-none">
              The <span className="text-brand-primary">Archive</span>
            </h1>
            <p className="text-white/40 font-medium uppercase tracking-widest text-[8px] sm:text-[10px]">
              Accessing {products.length} premium visual assets...
            </p>
          </div>
          
          <div className="relative w-full md:w-[450px] group">
            <div className="absolute inset-0 bg-brand-primary/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search the matrix..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-dark border border-white/5 rounded-2xl sm:rounded-[2rem] pl-14 sm:pl-16 pr-6 py-4 sm:py-6 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-[10px] sm:text-xs placeholder:text-white/10"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-6 sm:space-y-12">
            <div className="glass-dark p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5">
              <h4 className="font-black uppercase tracking-[0.3em] text-[8px] sm:text-[10px] text-white/30 mb-6 sm:mb-8 flex items-center gap-3">
                <Filter size={14} className="text-brand-primary" /> Sector Filter
              </h4>
              <div className="flex flex-wrap lg:flex-col gap-2 sm:gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "px-4 sm:px-6 py-2 sm:py-4 rounded-full sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all text-left border relative overflow-hidden group",
                      category === cat 
                        ? 'bg-brand-primary text-white border-brand-primary shadow-[0_0_20px_rgba(242,125,38,0.3)]' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                    )}
                  >
                    <span className="relative z-10">{cat}</span>
                    {category === cat && (
                      <motion.div 
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-brand-primary"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-dark p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5">
              <h4 className="font-black uppercase tracking-[0.3em] text-[8px] sm:text-[10px] text-white/30 mb-6 sm:mb-8 flex items-center gap-3">
                <SlidersHorizontal size={14} className="text-brand-primary" /> Sequence
              </h4>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-primary appearance-none cursor-pointer"
                >
                  <option value="newest" className="bg-[#0a0a0a]">Newest First</option>
                  <option value="price-low" className="bg-[#0a0a0a]">Price: Low to High</option>
                  <option value="price-high" className="bg-[#0a0a0a]">Price: High to Low</option>
                </select>
                <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                  <SlidersHorizontal size={12} />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-10"
                >
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[500px] flex flex-col items-center justify-center glass-dark rounded-[3rem] text-center p-12 border border-white/5"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                    <Search size={40} className="text-white/10" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">No data found in the matrix</h3>
                  <p className="text-white/30 font-medium uppercase tracking-widest text-xs">Try adjusting your filters or search terms.</p>
                  <button 
                    onClick={() => {setSearch(''); setCategory('All');}}
                    className="mt-10 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary hover:text-white transition-all active:scale-95 shadow-xl"
                  >
                    Reset System Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
