import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Zap, ShieldCheck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-black relative overflow-hidden">
        {/* Grid Background */}
        <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="fixed inset-0 scanline pointer-events-none opacity-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark p-16 rounded-[4rem] border border-white/5 max-w-xl relative z-10"
        >
          <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-10 mx-auto border border-white/5 relative group">
            <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ShoppingBag size={56} className="text-white/10 group-hover:text-brand-primary transition-colors relative z-10" />
          </div>
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-glow">Inventory Empty</h2>
          <p className="text-white/30 font-medium uppercase tracking-widest text-xs mb-12 max-w-sm mx-auto leading-loose">
            Your personal archive is currently void of visual assets. Initialize a scan of the shop to find new items.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-4 px-12 py-6 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all active:scale-95 shadow-2xl group"
          >
            Access Archive <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const shipping = 49;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-6 mb-16">
          <h1 className="text-6xl font-black tracking-tighter uppercase text-glow">Your <span className="text-brand-primary">Manifest</span></h1>
          <div className="h-px flex-grow bg-white/5" />
          <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
            {cart.length} Items Indexed
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-dark rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center gap-8 border border-white/5 group hover:border-white/10 transition-all"
                >
                  <Link to={`/product/${item.id}`} className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 border border-white/5 relative group/img">
                    <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover/img:opacity-100 transition-opacity z-10" />
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </Link>
                  
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <Link to={`/product/${item.id}`} className="font-black text-2xl uppercase tracking-tighter hover:text-brand-primary transition-colors block">
                          {item.name}
                        </Link>
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                          Sector: {item.category}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center gap-6">
                      <div className="flex items-center glass-dark rounded-2xl p-1 border border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-brand-primary transition-colors font-black text-lg"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-brand-primary transition-colors font-black text-lg"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Subtotal</div>
                        <span className="text-2xl font-black text-glow">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark rounded-[3rem] p-10 sticky top-32 border border-white/5 shadow-2xl"
            >
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                <Zap size={24} className="text-brand-primary" /> Summary
              </h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>Subtotal</span>
                  <span className="text-white">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>Logistics</span>
                  <span className="text-white">₹{shipping}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>System Tax (18%)</span>
                  <span className="text-white">₹{tax}</span>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Total Credits</div>
                    <div className="text-4xl font-black text-glow leading-none">₹{total}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/checkout" 
                  className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-primary hover:text-white transition-all active:scale-95 shadow-xl group"
                >
                  Initialize Checkout <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link 
                  to="/shop" 
                  className="w-full h-16 glass-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center border border-white/5 hover:bg-white/5 transition-all"
                >
                  Continue Scanning
                </Link>
              </div>

              <div className="mt-10 pt-10 border-t border-white/5">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">
                  <ShieldCheck size={14} className="text-brand-primary" /> Secure Transaction Protocol
                </div>
                <div className="flex items-center justify-center gap-6 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <CreditCard size={24} />
                  <Zap size={24} />
                  <ShieldCheck size={24} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
