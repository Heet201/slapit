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
  Image as ImageIcon
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
import { apiService } from '../services/apiService';

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
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
          setLoading(false);
        } else if (user.email === "dhruvidhameliya01@gmail.com") {
          // Default admin check
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
      if (file.size > 800000) { // Limit to ~800KB for Firestore document limit
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
        await apiService.updateProduct(editingProduct.id, productForm);
      } else {
        await apiService.createProduct({
          ...productForm,
          rating: 4.5,
          reviews: 0
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
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await apiService.deleteProduct(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/10 flex flex-col p-6 sticky top-0 h-screen">
        <div className="text-2xl font-black tracking-tighter mb-12 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white text-xs">A</div>
          ADMIN<span className="text-brand-primary">PANEL</span>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { id: 'products', icon: <Package size={20} />, label: 'Products' },
            { id: 'orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
            { id: 'users', icon: <Users size={20} />, label: 'Users' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id ? 'bg-brand-primary text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            {activeTab === 'dashboard' && 'Overview'}
            {activeTab === 'products' && 'Product Management'}
            {activeTab === 'orders' && 'Order Management'}
            {activeTab === 'users' && 'User Management'}
          </h2>
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
              className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-brand-secondary transition-all"
            >
              <Plus size={20} /> Add Product
            </button>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + o.total, 0)}`, icon: <ShoppingBag />, color: 'text-green-500' },
              { label: 'Total Orders', value: orders.length, icon: <ShoppingBag />, color: 'text-blue-500' },
              { label: 'Total Products', value: products.length, icon: <Package />, color: 'text-brand-primary' },
              { label: 'Total Users', value: users.length, icon: <Users />, color: 'text-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="glass p-8 rounded-3xl">
                <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
                  {stat.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                <h4 className="text-3xl font-black">{stat.value}</h4>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="glass rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="px-6 py-4 font-bold">{product.name}</td>
                    <td className="px-6 py-4 text-white/50">{product.category}</td>
                    <td className="px-6 py-4 font-black">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
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
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
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
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="glass p-8 rounded-3xl flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Order ID: {order.id.slice(0, 8)}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h4 className="text-xl font-black">₹{order.total}</h4>
                  <p className="text-sm text-white/50 max-w-md">{order.shippingAddress}</p>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                      className="p-2 glass hover:text-yellow-500 rounded-lg transition-all"
                    >
                      <Clock size={18} />
                    </button>
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                      className="p-2 glass hover:text-blue-500 rounded-lg transition-all"
                    >
                      <Truck size={18} />
                    </button>
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                      className="p-2 glass hover:text-green-500 rounded-lg transition-all"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-white/30">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold">{user.displayName || 'Anonymous'}</td>
                    <td className="px-6 py-4 text-white/50">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-white/50'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/30">
                      {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass w-full max-w-2xl rounded-[3rem] p-10 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="Cyberpunk Panda" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                        placeholder="199" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Category</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary"
                      >
                        {['Anime', 'Coding', 'Memes', 'Quotes', 'Aesthetic'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Product Image</label>
                    <div className="relative aspect-square glass rounded-3xl overflow-hidden group border-2 border-dashed border-white/10 hover:border-brand-primary transition-all">
                      {productForm.image ? (
                        <>
                          <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2">
                              <Upload size={14} /> Change Photo
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-4 text-white/30 hover:text-white transition-all">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                            <ImageIcon size={32} />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-sm">Upload Sticker Photo</p>
                            <p className="text-[10px] uppercase tracking-widest mt-1">PNG, JPG up to 800KB</p>
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Description</label>
                  <textarea 
                    rows={3} 
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Describe your sticker..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary resize-none"
                  ></textarea>
                </div>

                <button className="w-full h-16 bg-brand-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all active:scale-95">
                  {editingProduct ? 'Update Product' : 'Create Product'}
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
