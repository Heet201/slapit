import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Shield, Zap, RefreshCw, ShoppingCart, ArrowLeft, Heart, Share2, Info, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const productData = await apiService.getProductById(id);
        
        if (productData) {
          setProduct(productData);
          
          // Fetch all products to filter related ones (simplified for demo)
          const allProducts = await apiService.getProducts();
          setRelatedProducts(
            allProducts
              .filter((p: any) => p.category === productData.category && p.id !== id)
              .slice(0, 4)
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

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

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-black">
        <div className="glass-dark p-12 rounded-[3rem] border border-white/5 max-w-lg">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 mx-auto border border-white/5">
            <Info size={40} className="text-brand-primary" />
          </div>
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-glow">Data Missing</h2>
          <p className="text-white/30 font-medium uppercase tracking-widest text-xs mb-10">The requested asset could not be retrieved from the matrix.</p>
          <Link 
            to="/shop" 
            className="inline-block px-10 py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl"
          >
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  const images = [
    product.image,
    `https://picsum.photos/seed/${product.id}1/800/800`,
    `https://picsum.photos/seed/${product.id}2/800/800`,
    `https://picsum.photos/seed/${product.id}3/800/800`,
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link to="/shop" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-brand-primary transition-all mb-16 group">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-primary transition-colors">
            <ArrowLeft size={14} />
          </div>
          Back to Archive
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40">
          {/* Image Gallery */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square glass-dark rounded-[3rem] overflow-hidden border border-white/5 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 left-8 z-20">
                <div className="glass-dark px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                  Asset ID: {product.id.slice(0, 8)}
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-4 gap-6">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "aspect-square glass-dark rounded-2xl overflow-hidden border transition-all relative group",
                    activeImage === i ? "border-brand-primary shadow-[0_0_15px_rgba(242,125,38,0.3)]" : "border-white/5 opacity-40 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {activeImage === i && (
                    <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary">
                    {product.category}
                  </span>
                  <div className="h-px w-8 bg-white/10" />
                  <div className="flex items-center gap-1.5 text-yellow-500">
                    <Star size={14} className="fill-current" />
                    <span className="text-[10px] font-black text-white tracking-widest">{product.rating}</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">({product.reviews} Logs)</span>
                  </div>
                </div>
                
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase text-glow leading-none">
                  {product.name}
                </h1>
                
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-black text-brand-primary">₹{product.price}</span>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Credits Required</span>
                </div>
              </div>

              <p className="text-white/40 leading-relaxed text-base sm:text-lg font-medium">
                {product.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {product.features?.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 glass-dark p-4 rounded-2xl border border-white/5 group hover:border-brand-primary/30 transition-colors">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                      {feature === "Waterproof" ? <Zap size={18} /> : <Shield size={18} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-8 pt-10">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center justify-between glass-dark rounded-2xl p-1.5 border border-white/5">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-brand-primary transition-colors font-black text-xl"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-black text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-brand-primary transition-colors font-black text-xl"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-grow bg-white text-black h-16 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-primary hover:text-white transition-all active:scale-95 shadow-2xl group"
                  >
                    <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" /> 
                    Initialize Purchase
                  </button>
                  
                  <button className="hidden sm:flex w-16 h-16 glass-dark rounded-2xl items-center justify-center border border-white/5 text-white/30 hover:text-brand-secondary hover:border-brand-secondary/30 transition-all">
                    <Heart size={24} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                    <RefreshCw size={14} className="text-brand-primary" /> 30-Day Protocol Return
                  </div>
                  <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors group">
                    <Share2 size={14} className="group-hover:text-brand-primary transition-colors" /> Share Signal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="relative">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-glow">Similar Assets</h2>
              <div className="h-px flex-grow bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
