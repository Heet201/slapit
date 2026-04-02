import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, Mail, User, CheckCircle2, Zap, ArrowRight, Wallet, Smartphone, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    pincode: '',
    paymentMethod: 'UPI'
  });

  const finalTotal = cartTotal + 49 + Math.round(cartTotal * 0.18);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);
      if (!user) {
        navigate('/login?redirect=checkout');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login?redirect=checkout');
        return;
      }

      const orderData = {
        userId: user.uid,
        customerEmail: user.email,
        customerName: formData.fullName,
        phone: formData.phone,
        shippingAddress: formData.address,
        pincode: formData.pincode,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: finalTotal,
        status: 'pending',
        paymentMethod: formData.paymentMethod,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 4000);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="w-32 h-32 bg-brand-primary rounded-full flex items-center justify-center text-white mb-10 mx-auto shadow-[0_0_30px_rgba(242,125,38,0.5)]"
          >
            <CheckCircle2 size={56} />
          </motion.div>
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-glow">Transmission Success</h2>
          <p className="text-white/30 font-medium uppercase tracking-widest text-xs mb-12 max-w-sm mx-auto leading-loose">
            Your order has been successfully logged in the matrix. Our logistics drones are initializing the delivery protocol.
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary animate-pulse">
            Redirecting to main terminal...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-6 mb-16">
          <h1 className="text-6xl font-black tracking-tighter uppercase text-glow">Final <span className="text-brand-primary">Protocol</span></h1>
          <div className="h-px flex-grow bg-white/5" />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-16">
            {/* Shipping Info */}
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20">
                  <Truck size={24} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Logistics Data</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Recipient Identity</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="ENTER NAME" 
                      className="w-full glass-dark border border-white/5 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-xs placeholder:text-white/5" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Signal Frequency</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 00000 00000" 
                      className="w-full glass-dark border border-white/5 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-xs placeholder:text-white/5" 
                    />
                  </div>
                </div>
                <div className="md:col-span-1 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Delivery Coordinates</label>
                  <div className="relative group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="ENTER FULL ADDRESS" 
                      className="w-full glass-dark border border-white/5 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-xs placeholder:text-white/5" 
                    />
                  </div>
                </div>
                <div className="md:col-span-1 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Area Code (Pincode)</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="000000" 
                      className="w-full glass-dark border border-white/5 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-xs placeholder:text-white/5" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Info */}
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Credit Transfer</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: 'UPI', icon: Smartphone, label: 'Digital UPI' },
                  { id: 'Card', icon: CreditCard, label: 'Credit Card' },
                  { id: 'COD', icon: Banknote, label: 'Cash On Delivery' }
                ].map((method) => (
                  <button 
                    key={method.id} 
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    className={cn(
                      "glass-dark p-8 rounded-[2rem] flex flex-col items-center gap-6 transition-all group border relative overflow-hidden",
                      formData.paymentMethod === method.id 
                        ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_20px_rgba(242,125,38,0.2)]' 
                        : 'border-white/5 hover:border-white/20'
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                      formData.paymentMethod === method.id ? 'bg-brand-primary text-white' : 'bg-white/5 text-white/20 group-hover:text-brand-primary'
                    )}>
                      <method.icon size={28} />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">{method.label}</span>
                    {formData.paymentMethod === method.id && (
                      <motion.div layoutId="activePayment" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary" />
                    )}
                  </button>
                ))}
              </div>
            </section>
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
                  <span>Assets Subtotal</span>
                  <span className="text-white">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>Logistics Protocol</span>
                  <span className="text-white">₹49</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>System Tax (18%)</span>
                  <span className="text-white">₹{Math.round(cartTotal * 0.18)}</span>
                </div>
                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Total Credits</div>
                    <div className="text-4xl font-black text-glow leading-none">₹{finalTotal}</div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {formData.paymentMethod === 'COD' ? 'Confirm Order' : 'Authorize Payment'} 
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                  <ShieldCheck size={14} className="text-brand-primary" /> 256-Bit SSL Encrypted Signal
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
