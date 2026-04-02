import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { apiService } from '../services/apiService';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const categories = [
    { 
      name: "Anime", 
      size: "large", 
      color: "from-purple-600/30", 
      bgImg: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      name: "Coding", 
      size: "small", 
      color: "from-blue-600/30", 
      bgImg: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      name: "Memes", 
      size: "small", 
      color: "from-green-600/30", 
      bgImg: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      name: "Quotes", 
      size: "medium", 
      color: "from-orange-600/30", 
      bgImg: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      name: "Aesthetic", 
      size: "medium", 
      color: "from-pink-600/30", 
      bgImg: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      const data = await apiService.getProducts();
      setTrendingProducts(data.slice(0, 4));
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="overflow-hidden bg-[#050505] grid-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Futuristic Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full scanline opacity-20" />
          
          {/* Animated Floating Stickers in Background */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: mousePos.x * (i + 1) * 0.5,
                y: mousePos.y * (i + 1) * 0.5,
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
                x: { type: "spring", stiffness: 50, damping: 20 },
                y: { type: "spring", stiffness: 50, damping: 20 },
              }}
              className="absolute hidden lg:block opacity-10 pointer-events-none"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + (i % 3) * 30}%`,
              }}
            >
              <div className="w-32 h-32 border-4 border-brand-primary/30 rounded-3xl rotate-12 flex items-center justify-center font-black text-brand-primary/30 text-xs uppercase tracking-widest">
                SLAP
              </div>
            </motion.div>
          ))}

          <motion.div 
            animate={{ 
              x: mousePos.x * -2, 
              y: mousePos.y * -2,
              scale: [1, 1.1, 1],
            }}
            transition={{
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              x: { type: "spring", stiffness: 50, damping: 20 },
              y: { type: "spring", stiffness: 50, damping: 20 },
            }}
            style={{ y: y1 }}
            className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-primary/30 blur-[180px] rounded-full opacity-60" 
          />
          <motion.div 
            animate={{ 
              x: mousePos.x * 2, 
              y: mousePos.y * 2,
              scale: [1, 1.2, 1],
            }}
            transition={{
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              x: { type: "spring", stiffness: 50, damping: 20 },
              y: { type: "spring", stiffness: 50, damping: 20 },
            }}
            style={{ y: y2 }}
            className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-blue-600/20 blur-[220px] rounded-full opacity-50" 
          />
          <motion.div 
            animate={{ 
              x: mousePos.x * 1.5, 
              y: mousePos.y * -1.5,
              scale: [1, 1.15, 1],
            }}
            transition={{
              scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              x: { type: "spring", stiffness: 50, damping: 20 },
              y: { type: "spring", stiffness: 50, damping: 20 },
            }}
            className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-purple-600/15 blur-[160px] rounded-full opacity-40" 
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#050505]/40 to-[#050505]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-6 py-3 glass-dark rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-12 border-brand-primary/20 shadow-[0_0_30px_rgba(242,125,38,0.1)]"
          >
            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse shadow-[0_0_10px_#f27d26]" />
            The Future of Expression
          </motion.div>
          
          <div className="relative mb-12">
            <motion.h1
              className="text-[15vw] md:text-[11rem] font-black tracking-tighter leading-[0.8] uppercase"
            >
              <motion.span 
                initial={{ opacity: 0, y: 50, rotateX: -45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="block text-white text-glow mb-2"
              >
                Slap
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 50, rotateX: -45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="block text-gradient italic"
              >
                The Future
              </motion.span>
            </motion.h1>
            
            {/* Luxurious Decorative Elements */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute -left-20 top-1/2 h-px bg-linear-to-r from-transparent to-brand-primary hidden lg:block" 
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute -right-20 top-1/2 h-px bg-linear-to-l from-transparent to-brand-primary hidden lg:block" 
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="space-y-4 mb-16"
          >
            <p className="text-white/60 text-xs md:text-sm font-black uppercase tracking-[0.5em]">
              Premium Vinyl • Zero Residue • 2026 Edition
            </p>
            <p className="text-white/30 text-sm md:text-lg max-w-xl mx-auto font-medium uppercase tracking-[0.2em] leading-relaxed">
              Engineered for the bold. <br /> 
              Infinite style for the modern vibe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
          >
            <Link 
              to="/shop" 
              className="w-full sm:w-auto group relative px-10 sm:px-16 py-5 sm:py-7 bg-brand-primary text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(242,125,38,0.3)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Enter The Shop <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <Link 
              to="/about" 
              className="w-full sm:w-auto group px-10 sm:px-16 py-5 sm:py-7 glass-dark text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 hover:border-white/30"
            >
              <span className="group-hover:text-brand-primary transition-colors">Our DNA</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <div className="w-px h-12 bg-linear-to-b from-brand-primary to-transparent" />
          <span className="text-[8px] font-black uppercase tracking-widest">Scroll</span>
        </motion.div>
      </section>

      {/* Bento Categories Section */}
      <section className="py-16 sm:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-20">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase mb-4">
              The <span className="text-brand-primary">Collections</span>
            </h2>
            <div className="w-20 h-1 bg-brand-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 sm:gap-6 md:h-[800px]">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden glass-dark border-white/5 cursor-pointer min-h-[250px]
                  ${cat.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                  ${cat.size === 'medium' ? 'md:col-span-2' : ''}
                `}
              >
                <img 
                  src={cat.bgImg} 
                  alt={cat.name} 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-linear-to-br ${cat.color} to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                


                <div className="absolute inset-0 flex flex-col justify-end p-10 bg-linear-to-t from-black/60 via-transparent to-transparent">
                  <div className="transform group-hover:-translate-y-2 transition-transform duration-300">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-2 block">Category</span>
                    <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">{cat.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                      Explore
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 sm:py-32 px-6 bg-black/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-20 gap-8">
            <div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase mb-4">Trending <span className="text-brand-primary">Now</span></h2>
              <p className="text-white/30 font-medium uppercase tracking-widest text-[10px] sm:text-sm">The most slapped stickers of the month.</p>
            </div>
            <Link to="/shop" className="w-full sm:w-auto group flex items-center justify-center gap-4 px-8 py-4 glass-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-primary transition-all">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : trendingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {trendingProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass-dark rounded-[3rem] border-dashed border-white/10">
              <p className="text-white/20 font-black uppercase tracking-[0.5em]">No data found in the matrix.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Bento Style */}
      <section className="py-16 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { title: "Hyper-Speed", desc: "Same-day shipping for all local orders." },
              { title: "Titan-Grade", desc: "Premium vinyl that resists everything." },
              { title: "Global Reach", desc: "Slapping vibes across the entire planet." },
              { title: "Zero Trace", desc: "Removes cleanly without a single mark." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative glass-dark p-12 rounded-[3rem] border-white/5 hover:border-brand-primary/30 transition-all group overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-primary/5 blur-[60px] rounded-full group-hover:bg-brand-primary/10 transition-colors duration-500" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-4xl font-black text-white/5 group-hover:text-brand-primary/20 transition-colors duration-500">
                      0{i + 1}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-brand-primary/40 px-3 py-1 border border-brand-primary/20 rounded-full">
                      Feature
                    </span>
                  </div>
                  
                  <h4 className="text-3xl font-black uppercase tracking-tighter mb-6 group-hover:text-brand-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  
                  <div className="w-12 h-1 bg-white/10 mb-6 group-hover:w-full group-hover:bg-brand-primary transition-all duration-500" />
                  
                  <p className="text-white/40 text-sm leading-relaxed font-medium uppercase tracking-wider">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative glass-dark rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-24 overflow-hidden text-center border-brand-primary/20">
            <div className="absolute top-0 left-0 w-full h-full scanline opacity-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/20 blur-[120px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-7xl font-black uppercase tracking-tighter mb-6 sm:mb-8">
                Ready to <span className="text-gradient italic">Slap?</span>
              </h2>
              <p className="text-white/40 text-sm sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-12 font-medium uppercase tracking-widest">
                Join the elite community of sticker enthusiasts. <br className="hidden sm:block" />
                Limited edition drops every week.
              </p>
              <Link 
                to="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-10 sm:px-12 py-5 sm:py-6 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                Join The Vibe <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
