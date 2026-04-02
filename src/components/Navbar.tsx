import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Heart, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check Firestore for admin role
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const isDefaultAdmin = currentUser.email === "dhruvidhameliya01@gmail.com";
        
        if ((userDoc.exists() && userDoc.data().role === 'admin') || isDefaultAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-1 group">
          <div className="flex">
            {"SLAPIT".split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 0, rotate: 0 }}
                whileHover={{ 
                  y: -10, 
                  rotate: [0, -10, 10, 0],
                  color: i % 2 === 0 ? "#f27d26" : "#ff4444"
                }}
                transition={{ type: "spring", stiffness: 400 }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.div 
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-6 bg-white text-black rounded-sm flex items-center justify-center text-[10px] font-bold sticker-border -rotate-12 ml-2"
          >
            NEW
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-primary",
                location.pathname === link.path ? "text-brand-primary" : "text-white/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-bold text-brand-primary flex items-center gap-1 hover:underline"
            >
              <LayoutDashboard size={14} /> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:text-brand-primary transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          
          <Link to="/cart" className="p-2 hover:text-brand-primary transition-colors relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Welcome</span>
                <span className="text-xs font-bold text-white truncate max-w-[100px]">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:text-brand-primary transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="p-2 hover:text-brand-primary transition-colors">
              <User size={20} />
            </Link>
          )}

          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-brand-primary"
                >
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="text-lg font-medium text-red-500 flex items-center gap-2"
                >
                  <LogOut size={20} /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
