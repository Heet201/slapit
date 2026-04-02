import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Star, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative glass-dark rounded-[2rem] overflow-hidden border-white/5 hover:border-brand-primary/30 transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden p-6 relative">
        <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-full h-full sticker-border rounded-2xl overflow-hidden shadow-2xl relative z-10"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Quick View Icon */}
        <div className="absolute top-8 right-8 w-10 h-10 glass-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
          <ArrowUpRight size={18} className="text-brand-primary" />
        </div>
      </Link>
      
      <div className="p-8 pt-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60 mb-2 block">
              {product.category}
            </span>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-black text-xl uppercase tracking-tighter group-hover:text-brand-primary transition-colors leading-none">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full text-[10px] font-black border-white/5">
            <Star size={10} className="fill-brand-primary text-brand-primary" />
            {product.rating}
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Price</span>
            <span className="text-2xl font-black tracking-tighter">₹{product.price}</span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="group/btn relative w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-brand-primary hover:text-white hover:scale-110 active:scale-95 shadow-xl"
          >
            <Plus size={24} className="relative z-10" />
            <div className="absolute inset-0 bg-brand-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
      
      {/* Decorative Scanline on Card */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default ProductCard;
