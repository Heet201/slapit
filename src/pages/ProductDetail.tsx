import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Shield, Zap, RefreshCw, ShoppingCart, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Product Not Found</h2>
        <Link to="/shop" className="text-brand-primary font-bold hover:underline uppercase tracking-widest text-sm">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <Link to="/shop" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square glass rounded-3xl overflow-hidden group"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square glass rounded-xl overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                <img src={`https://picsum.photos/seed/${product.id + i}/200/200`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={14} className="fill-current" />
                <span className="text-sm font-bold text-white">{product.rating}</span>
                <span className="text-sm text-white/30">({product.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">{product.name}</h1>
            <p className="text-3xl font-black text-brand-primary">₹{product.price}</p>
          </div>

          <p className="text-white/60 leading-relaxed mb-10 text-lg">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-10">
            {product.features?.map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-brand-primary">
                  {feature === "Waterproof" ? <Zap size={16} /> : <Shield size={16} />}
                </div>
                {feature}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center glass rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:text-brand-primary transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center hover:text-brand-primary transition-colors"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => addToCart(product)}
              className="flex-grow bg-white text-black h-12 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-all active:scale-95"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="w-12 h-12 glass rounded-full flex items-center justify-center hover:text-brand-secondary transition-colors">
              <Heart size={20} />
            </button>
          </div>

          <div className="pt-10 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <RefreshCw size={14} /> 30-Day Easy Returns
            </div>
            <button className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-12">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
