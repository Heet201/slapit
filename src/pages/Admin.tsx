import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  Truck, 
  X,
  Search,
  Filter,
  LogOut,
  Upload,
  Image as ImageIcon,
  Zap,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { db, auth } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const navigate = useNavigate();

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: 'Aesthetic',
    image: '',
    description: '',
    features: ['Waterproof', 'Premium Vinyl']
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const adminEmails = ["dhruvidhameliya01@gmail.com", "dhameliyaheet201@gmail.com"];
        const isDefaultAdmin = adminEmails.includes(user.email || "");
        
        if ((userDoc.exists() && userDoc.data().role === 'admin') || isDefaultAdmin) {
          setIsAdmin(true);
          setLoading(false);
        } else {
          navigate('/');
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubProducts = onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubUsers();
    };
  }, [isAdmin]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        alert("Image is too large! Please select an image under 800KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, {
          ...productForm,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productForm,
          rating: 4.5,
          reviews: 0,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: 0,
        category: 'Aesthetic',
        image: '',
        description: '',
        features: ['Waterproof', 'Premium Vinyl']
      });
    } catch (error) {
      console.error("Error adding/updating product:", error);
      alert("Failed to save product. Check console for details.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Check console for details.");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-primary/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-10" />

      {/* Sidebar */}
      <aside className="w-72 glass-dark border-r border-white/5 flex flex-col p-8 relative z-10">
        <div className="text-3xl font-black tracking-tighter mb-16 flex items-center gap-3">
          <div className="relative">
            <Zap size={24} className="text-brand-primary fill-brand-primary" />
            <div className="absolute inset-0 blur-lg bg-brand-primary/50" />
          </div>
          <span className="text-glow">CORE<span className="text-brand-primary">OS</span></span>
        </div>

        <nav className="flex-grow space-y-3">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
            { id: 'products', icon: <Package size={18} />, label: 'Inventory' },
            { id: 'orders', icon: <ShoppingBag size={18} />, label: 'Transmissions' },
            { id: 'users', icon: <Users size={18} />, label: 'Entities' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 relative group ${
                activeTab === item.id 
                  ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(242,125,38,0.3)]' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={18} />
          Terminate
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto relative z-10 custom-scrollbar">
        <header className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-2 block">System Command</span>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-glow">
              {activeTab === 'dashboard' && 'Neural Overview'}
              {activeTab === 'products' && 'Asset Management'}
              {activeTab === 'orders' && 'Transmission Logs'}
              {activeTab === 'users' && 'Entity Database'}
            </h2>
          </div>
          
          {activeTab === 'products' && (
            <button 
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  price: 0,
                  category: 'Aesthetic',
                  image: '',
                  description: '',
                  features: ['Waterproof', 'Premium Vinyl']
                });
                setIsModalOpen(true);
              }}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-brand-primary hover:text-white transition-all shadow-xl active:scale-95"
            >
              <Plus size={18} /> Initialize Asset
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + o.total, 0)}`, icon: <ShoppingBag />, color: 'text-green-400' },
                    { label: 'Transmissions', value: orders.length, icon: <Zap />, color: 'text-blue-400' },
                    { label: 'Active Assets', value: products.length, icon: <Package />, color: 'text-brand-primary' },
                    { label: 'Linked Entities', value: users.length, icon: <Users />, color: 'text-purple-400' },
                  ].map((stat, i) => (
                    <div key={i} className="glass-dark p-8 rounded-[2rem] border border-white/5 relative group overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 ${stat.color} border border-white/5`}>
                        {stat.icon}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{stat.label}</p>
                      <h4 className="text-4xl font-black tracking-tighter">{stat.value}</h4>
                    </div>
                  ))}
                </div>

                {/* Recent Activity Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-dark rounded-[2.5rem] p-10 border border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                      <Clock size={20} className="text-brand-primary" /> Recent Transmissions
                    </h3>
                    <div className="space-y-6">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-xs">
                              {order.id.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-sm uppercase tracking-tight">₹{order.total}</p>
                              <p className="text-[10px] text-white/30 uppercase tracking-widest">{order.status}</p>
                            </div>
                          </div>
                          <ArrowUpRight size={16} className="text-white/20 group-hover:text-brand-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-dark rounded-[2.5rem] p-10 border border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                      <Users size={20} className="text-brand-primary" /> New Entities
                    </h3>
                    <div className="space-y-6">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-black text-xs">
                              {user.displayName?.slice(0, 2).toUpperCase() || 'AN'}
                            </div>
                            <div>
                              <p className="font-black text-sm uppercase tracking-tight">{user.displayName || 'Anonymous'}</p>
                              <p className="text-[10px] text-white/30 uppercase tracking-widest">{user.email}</p>
                            </div>
                          </div>
                          <ExternalLink size={16} className="text-white/20 group-hover:text-brand-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="glass-dark rounded-[2.5rem] overflow-hidden border border-white/5">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                    <tr>
                      <th className="px-10 py-6">Visual</th>
                      <th className="px-10 py-6">Identity</th>
                      <th className="px-10 py-6">Sector</th>
                      <th className="px-10 py-6">Value</th>
                      <th className="px-10 py-6 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-brand-primary/50 transition-colors">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <p className="font-black text-lg uppercase tracking-tighter">{product.name}</p>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">ID: {product.id.slice(0, 8)}</p>
                        </td>
                        <td className="px-10 py-6">
                          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/5">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-10 py-6 font-black text-xl tracking-tighter">₹{product.price}</td>
                        <td className="px-10 py-6">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setProductForm({
                                  name: product.name,
                                  price: product.price,
                                  category: product.category,
                                  image: product.image,
                                  description: product.description,
                                  features: product.features
                                });
                                setIsModalOpen(true);
                              }}
                              className="w-10 h-10 glass-dark flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-white rounded-xl transition-all border border-white/5"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="w-10 h-10 glass-dark flex items-center justify-center text-red-400 hover:bg-red-400 hover:text-white rounded-xl transition-all border border-white/5"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="glass-dark p-10 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between gap-10 hover:border-brand-primary/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[80px] pointer-events-none" />
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Log ID: {order.id.slice(0, 12)}</span>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 ${
                          order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                          order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {order.status}
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 bg-white/5 text-white/40">
                          {order.paymentMethod || 'UPI'}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-4xl font-black tracking-tighter mb-2">₹{order.total}</h4>
                        <p className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1">{order.customerName} • {order.phone}</p>
                        <p className="text-xs font-medium text-white/50 max-w-md leading-relaxed uppercase tracking-wide">
                          {order.shippingAddress} <span className="text-brand-primary">[{order.pincode}]</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                        <Clock size={12} />
                        {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Processing...'}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end relative z-10">
                      <div className="flex gap-3">
                        {[
                          { status: 'processing', icon: <Clock size={18} />, color: 'hover:text-yellow-400' },
                          { status: 'shipped', icon: <Truck size={18} />, color: 'hover:text-blue-400' },
                          { status: 'delivered', icon: <CheckCircle size={18} />, color: 'hover:text-green-400' },
                        ].map((btn) => (
                          <button 
                            key={btn.status}
                            onClick={() => handleUpdateOrderStatus(order.id, btn.status)}
                            className={`w-14 h-14 glass-dark flex items-center justify-center rounded-2xl transition-all border border-white/5 ${btn.color} ${order.status === btn.status ? 'text-white bg-white/10 border-white/20' : 'text-white/30'}`}
                          >
                            {btn.icon}
                          </button>
                        ))}
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2 group/link">
                        View Full Manifest <ArrowUpRight size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="glass-dark rounded-[2.5rem] overflow-hidden border border-white/5">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                    <tr>
                      <th className="px-10 py-6">Entity</th>
                      <th className="px-10 py-6">Communication</th>
                      <th className="px-10 py-6">Clearance</th>
                      <th className="px-10 py-6 text-right">Initialization Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary font-black text-lg group-hover:border-brand-primary/50 transition-colors">
                              {user.displayName?.slice(0, 1).toUpperCase() || 'A'}
                            </div>
                            <p className="font-black text-lg uppercase tracking-tighter">{user.displayName || 'Anonymous Entity'}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-white/50 font-medium lowercase tracking-tight">{user.email}</td>
                        <td className="px-10 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            user.role === 'admin' 
                              ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' 
                              : 'bg-white/5 text-white/30 border-white/5'
                          }`}>
                            {user.role || 'Standard'}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                            {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-dark w-full max-w-3xl rounded-[3rem] p-12 overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] pointer-events-none" />
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>

              <div className="mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-2 block">Asset Initialization</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter text-glow">
                  {editingProduct ? 'Modify Asset' : 'New Asset Entry'}
                </h3>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Asset Designation</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="Cyberpunk Panda" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-tight text-lg" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Market Value (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                        placeholder="199" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-primary transition-all font-black text-lg" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Classification</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-xs appearance-none cursor-pointer"
                      >
                        {['Anime', 'Coding', 'Memes', 'Quotes', 'Aesthetic'].map(cat => (
                          <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Visual Manifest</label>
                    <div className="relative aspect-square glass-dark rounded-[2.5rem] overflow-hidden group border-2 border-dashed border-white/5 hover:border-brand-primary/50 transition-all">
                      {productForm.image ? (
                        <>
                          <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                            <label className="cursor-pointer bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform">
                              <Upload size={16} /> Update Matrix
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-6 text-white/20 hover:text-brand-primary transition-all">
                          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5 group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5 transition-all">
                            <ImageIcon size={36} />
                          </div>
                          <div className="text-center">
                            <p className="font-black text-sm uppercase tracking-widest">Inject Visual Data</p>
                            <p className="text-[8px] uppercase tracking-[0.3em] mt-2 opacity-50">PNG, JPG &lt; 800KB</p>
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Operational Brief</label>
                  <textarea 
                    rows={3} 
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Enter asset parameters..." 
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 focus:outline-none focus:border-brand-primary transition-all font-medium text-white/70 resize-none"
                  ></textarea>
                </div>

                <button className="w-full h-20 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:bg-brand-primary hover:text-white transition-all active:scale-95 shadow-2xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-brand-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-4">
                    {editingProduct ? <Edit size={20} /> : <Plus size={20} />}
                    {editingProduct ? 'Commit Changes' : 'Authorize Entry'}
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
