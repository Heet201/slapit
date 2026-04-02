import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, Mail, User, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'UPI'
  });

  const finalTotal = cartTotal + 49 + Math.round(cartTotal * 0.18);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setLoading(true);
    try {
      const orderData = {
        userId: auth.currentUser?.uid || 'guest',
        customerEmail: auth.currentUser?.email || 'guest@example.com',
        customerName: formData.fullName,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: finalTotal,
        status: 'pending',
        paymentMethod: formData.paymentMethod,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-5xl font-black tracking-tighter uppercase mb-4">Order Placed!</h2>
        <p className="text-white/60 mb-8 max-w-md">Your order has been successfully placed. We'll slap it on a truck and send it your way soon!</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-sm hover:bg-brand-primary hover:text-white transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-5xl font-black tracking-tighter uppercase mb-12">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {/* Shipping Info */}
          <section>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Truck className="text-brand-primary" /> Shipping Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary" 
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Shipping Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text" 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Creative St, Design District" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Payment Info */}
          <section>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              <CreditCard className="text-brand-primary" /> Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['UPI', 'Card', 'Wallet'].map((method) => (
                <button 
                  key={method} 
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method })}
                  className={`glass p-6 rounded-3xl flex flex-col items-center gap-4 transition-all group ${formData.paymentMethod === method ? 'border-brand-primary' : 'hover:border-white/20'}`}
                >
                  <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${formData.paymentMethod === method ? 'text-brand-primary' : 'group-hover:text-brand-primary'}`}>
                    <CreditCard size={24} />
                  </div>
                  <span className="font-bold uppercase tracking-tighter">{method}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-8 sticky top-32">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span className="font-bold text-white">₹49</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Tax</span>
                <span className="font-bold text-white">₹{Math.round(cartTotal * 0.18)}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-brand-primary">₹{finalTotal}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full h-14 bg-brand-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Pay ₹{finalTotal}</>
              )}
            </button>
            <p className="mt-6 text-[10px] text-center text-white/30 flex items-center justify-center gap-2">
              <ShieldCheck size={12} /> Secure 256-bit SSL Encrypted Payment
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
