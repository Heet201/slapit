import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, RefreshCw, Clock } from 'lucide-react';
import { apiService } from '../services/apiService';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ["Anime", "Coding", "Memes", "Quotes", "Aesthetic"];

  useEffect(() => {
    const loadData = async () => {
      const data = await apiService.getProducts();
      setTrendingProducts(data.slice(0, 4));
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 glass rounded-full text-xs font-bold uppercase tracking-widest text-brand-primary mb-8"
          >
            New Drop: Cyberpunk Collection 2026
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-8xl md:text-[12rem] font-black tracking-tighter leading-[0.75] mb-8"
          >
            SLAP <br />
            <span className="text-gradient italic">THE VIBE</span> <br />
            ON IT
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/60 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-bold uppercase tracking-tighter"
          >
            SLAPIT is for the bold. Premium, waterproof, and zero-residue stickers for those who don't follow the rules.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/shop" 
              className="px-10 py-5 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-brand-secondary transition-all hover:scale-105 flex items-center gap-2"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link 
              to="/about" 
              className="px-10 py-5 glass text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              Our Story
            </Link>
          </motion.div>
        </div>

        {/* Floating Stickers (Parallax) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 0.8, 
                scale: 1,
                y: [0, -40, 0],
                rotate: [i * 45, i * 45 + 10, i * 45]
              }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.2 }}
              className="absolute"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
              }}
            >
              <div className="w-32 h-32 sticker-border bg-white rounded-xl flex items-center justify-center p-2 -rotate-12">
                <img 
                  src={`https://picsum.photos/seed/sticker${i}/200/200`} 
                  alt="sticker" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Explore Categories</h2>
              <p className="text-white/50">Find the perfect match for your personality.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative h-64 glass rounded-3xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={`https://picsum.photos/seed/${cat}/400/600`} 
                  alt={cat} 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-linear-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-bold uppercase tracking-tighter">{cat}</h3>
                  <p className="text-xs text-white/50 group-hover:text-brand-primary transition-colors">Shop Now →</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Trending Now</h2>
              <p className="text-white/50">Most loved stickers this week.</p>
            </div>
            <Link to="/shop" className="text-brand-primary font-bold hover:underline">View All</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : trendingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-3xl">
              <p className="text-white/30 font-bold uppercase tracking-widest">No products found. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-brand-primary/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: <Zap size={32} />, title: "Waterproof", desc: "Built to survive spills and rain." },
            { icon: <Shield size={32} />, title: "Premium Vinyl", desc: "High-grade material for durability." },
            { icon: <RefreshCw size={32} />, title: "No Residue", desc: "Leaves no sticky mess when removed." },
            { icon: <Clock size={32} />, title: "Long Lasting", desc: "Colors that stay vibrant for years." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
              <p className="text-sm text-white/50">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
