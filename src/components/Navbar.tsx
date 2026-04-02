import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut, LayoutDashboard, Zap } from 'lucide-react';
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
        const adminEmails = ["dhruvidhameliya01@gmail.com", "dhameliyaheet201@gmail.com"];
        const isDefaultAdmin = adminEmails.includes(currentUser.email || "");
        
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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-6",
      scrolled ? "py-4" : "py-8"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-start gap-4 sm:gap-12 lg:gap-20 px-4 sm:px-8 py-3 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-500 border border-white/5",
        scrolled ? "glass-dark shadow-2xl backdrop-blur-2xl border-white/10" : "bg-transparent border-transparent"
      )}>
        <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 group shrink-0">
          <div className="relative">
            <Zap size={28} className="text-brand-primary fill-brand-primary animate-pulse" />
            <div className="absolute inset-0 blur-lg bg-brand-primary/50 animate-pulse" />
          </div>
          <div className="flex">
            {"SLAPIT".split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 0 }}
                whileHover={{ 
                  y: -5,
                  color: "#f27d26",
                  textShadow: "0 0 15px rgba(242, 125, 38, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 400 }}
                className="inline-block text-glow"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-brand-primary relative group",
                location.pathname === link.path ? "text-brand-primary" : "text-white/60"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full",
                location.pathname === link.path && "w-full"
              )} />
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <LayoutDashboard size={14} /> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-6 ml-auto">
          <button className="p-2 text-white/60 hover:text-brand-primary transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          
          <Link to="/cart" className="p-2 text-white/60 hover:text-brand-primary transition-colors relative group">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(242,125,38,0.5)]">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Authorized</span>
                <span className="text-[10px] font-black text-white uppercase tracking-wider truncate max-w-[100px]">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 glass-dark rounded-xl flex items-center justify-center text-white/60 hover:text-red-500 hover:border-red-500/30 transition-all border border-white/5"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="w-10 h-10 glass-dark rounded-xl flex items-center justify-center text-white/60 hover:text-brand-primary hover:border-brand-primary/30 transition-all border border-white/5">
              <User size={18} />
            </Link>
          )}

          <button 
            className="md:hidden w-10 h-10 glass-dark rounded-xl flex items-center justify-center text-white/60 border border-white/5"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-full left-6 right-6 mt-4 glass-dark border border-white/10 rounded-[2rem] p-8 md:hidden shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xl font-black uppercase tracking-[0.2em] transition-colors",
                    location.pathname === link.path ? "text-brand-primary" : "text-white/60"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-black uppercase tracking-[0.2em] text-brand-primary"
                >
                  Admin Portal
                </Link>
              )}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="text-xl font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-3"
                >
                  <LogOut size={20} /> Terminate Session
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-black uppercase tracking-[0.2em] text-white"
                >
                  Initialize Access
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
