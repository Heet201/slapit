import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Star } from 'lucide-react';
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
      whileHover={{ y: -5, rotate: 2 }}
      className="group relative glass rounded-2xl overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden p-4">
        <motion.div className="w-full h-full sticker-border rounded-xl overflow-hidden peel-effect">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-brand-primary font-semibold uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-bold text-lg group-hover:text-brand-primary transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-[10px] font-bold">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            {product.rating}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-black">₹{product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
