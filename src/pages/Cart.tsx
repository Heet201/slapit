import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 glass rounded-full flex items-center justify-center mb-8 text-white/20">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Your cart is empty</h2>
        <p className="text-white/50 mb-10 max-w-md mx-auto">
          Looks like you haven't added any stickers to your cart yet. Let's find something cool!
        </p>
        <Link 
          to="/shop" 
          className="px-10 py-5 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-brand-secondary transition-all flex items-center gap-2"
        >
          Browse Shop <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-5xl font-black tracking-tighter uppercase mb-12">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-3xl p-6 flex items-center gap-6"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </Link>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/product/${item.id}`} className="font-bold text-xl hover:text-brand-primary transition-colors">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/30 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-brand-primary font-semibold uppercase tracking-wider mb-4">
                    {item.category}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center glass rounded-full p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:text-brand-primary transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:text-brand-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-xl font-black">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-8 sticky top-32">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span className="font-bold text-white">₹49</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Tax (GST 18%)</span>
                <span className="font-bold text-white">₹{Math.round(cartTotal * 0.18)}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-black">
                <span>Total</span>
                <span className="text-brand-primary">₹{cartTotal + 49 + Math.round(cartTotal * 0.18)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Link 
                to="/checkout" 
                className="w-full h-14 bg-brand-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all active:scale-95"
              >
                Checkout Now <ArrowRight size={18} />
              </Link>
              <Link 
                to="/shop" 
                className="w-full h-14 glass text-white rounded-full font-bold flex items-center justify-center hover:bg-white/10 transition-all"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
