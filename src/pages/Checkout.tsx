import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, Mail, User, CheckCircle2, Zap, ArrowRight, Wallet, Smartphone, Banknote, Copy, Check, Download, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
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

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setPlacedOrder({ ...orderData, id: docRef.id });
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    if (placedOrder?.id) {
      navigator.clipboard.writeText(placedOrder.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('order-slip');
    if (!element) return;
    
    setDownloading(true);
    try {
      // Temporarily adjust styles for better capture
      const originalStyle = element.style.cssText;
      element.style.background = '#000000';
      element.style.borderRadius = '0px';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#000000',
        logging: false
      });
      
      element.style.cssText = originalStyle;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Order_Slip_${placedOrder.id.slice(-8).toUpperCase()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please use the Print option.');
    } finally {
      setDownloading(true);
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  if (success && placedOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-y-auto pt-24 pb-24">
        {/* Grid Background */}
        <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="fixed inset-0 scanline pointer-events-none opacity-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl relative z-10"
        >
          {/* Success Message */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center text-white mb-8 mx-auto shadow-[0_0_30px_rgba(242,125,38,0.5)]"
            >
              <CheckCircle2 size={40} />
            </motion.div>
            <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter text-glow">Transmission Success</h2>
            <p className="text-white/30 font-medium uppercase tracking-widest text-[10px] max-w-sm mx-auto leading-loose">
              Your order has been successfully logged in the matrix.
            </p>
          </div>

          {/* Digital Receipt / Slip */}
          <div id="order-slip" className="glass-dark rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden bg-black/40 backdrop-blur-3xl print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
            {/* Cyberpunk Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-brand-primary/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[80px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-12 border-b border-white/5 pb-8 print:border-black/10">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">Order Slip</h3>
                <div className="flex items-center gap-2 group cursor-pointer" onClick={copyOrderId}>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">#{placedOrder.id.slice(-8).toUpperCase()}</p>
                  {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-white/20 group-hover:text-brand-primary transition-colors" />}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Timestamp</p>
                <p className="text-xs font-bold uppercase tracking-widest">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Recipient</p>
                <p className="text-lg font-black uppercase tracking-tight">{placedOrder.customerName}</p>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">{placedOrder.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Coordinates</p>
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">{placedOrder.shippingAddress}</p>
                <p className="text-xs font-black text-brand-primary mt-1 tracking-[0.2em]">{placedOrder.pincode}</p>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Inventory Breakdown</p>
              {placedOrder.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-none print:border-black/10">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-brand-primary w-6">0{i+1}</span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">{item.name}</p>
                      <p className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-xs font-black tracking-widest">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-6 space-y-3 print:bg-black/5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                <span>Subtotal</span>
                <span className="text-white print:text-black">₹{placedOrder.total - 49 - Math.round((placedOrder.total - 49) / 1.18 * 0.18)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                <span>Logistics</span>
                <span className="text-white print:text-black">₹49</span>
              </div>
              <div className="flex justify-between text-lg font-black uppercase tracking-tighter pt-3 border-t border-white/10 print:border-black/10">
                <span className="text-brand-primary">Total Credits</span>
                <span className="text-glow">₹{placedOrder.total}</span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 text-center print:border-black/10">
              <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">Thank you for choosing the matrix</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 no-print">
            <button 
              onClick={downloadPDF}
              disabled={downloading}
              className="flex-1 h-16 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-primary/80 transition-all shadow-xl disabled:opacity-50"
            >
              {downloading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download size={18} /> Download PDF
                </>
              )}
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-primary hover:text-white transition-all shadow-xl"
            >
              <FileText size={18} /> Print Slip
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 h-16 glass-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/5 transition-all border border-white/5"
            >
              Return Terminal
            </button>
          </div>
        </motion.div>

        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * { visibility: hidden; background: white !important; }
            #order-slip, #order-slip * { visibility: visible; }
            #order-slip { 
              position: absolute; 
              left: 0; 
              top: 0; 
              width: 100%; 
              background: white !important;
              color: black !important;
              padding: 40px !important;
            }
            .no-print { display: none !important; }
            .text-glow { text-shadow: none !important; color: black !important; }
            .text-brand-primary { color: black !important; font-weight: 900 !important; }
            .glass-dark { background: white !important; border: 1px solid #eee !important; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-glow">Final <span className="text-brand-primary">Protocol</span></h1>
          <div className="h-px flex-grow bg-white/5 w-full sm:w-auto" />
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest animate-pulse">
              {error}
              <button onClick={() => setError(null)} className="ml-4 text-white/50 hover:text-white">X</button>
            </div>
          )}
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
