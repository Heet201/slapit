import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Zap, ShieldCheck, Fingerprint } from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Create user doc
        const isAdmin = userCredential.user.email === "dhruvidhameliya01@gmail.com" || userCredential.user.email === "dhameliyaheet201@gmail.com";
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: name,
          role: isAdmin ? 'admin' : 'user',
          createdAt: serverTimestamp()
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const isAdmin = result.user.email === "dhruvidhameliya01@gmail.com" || result.user.email === "dhameliyaheet201@gmail.com";
      
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        role: isAdmin ? 'admin' : 'user',
        createdAt: serverTimestamp()
      }, { merge: true });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-10" />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-secondary/10 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg glass-dark p-12 rounded-[4rem] border border-white/5 shadow-2xl"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary mx-auto mb-8 border border-brand-primary/20 shadow-[0_0_20px_rgba(242,125,38,0.2)]"
          >
            <Fingerprint size={40} />
          </motion.div>
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-glow">
            {isLogin ? 'Access <span className="text-brand-primary">Granted</span>' : 'Initialize <span className="text-brand-primary">Profile</span>'}
          </h2>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
            {isLogin ? 'Establish secure connection to terminal' : 'Register new identity in the matrix'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-5 rounded-2xl mb-8 flex items-center gap-3"
            >
              <Zap size={14} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Identity Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ENTER FULL NAME" 
                  className="w-full glass-dark border border-white/5 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-xs placeholder:text-white/5" 
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Signal Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL@TERMINAL.COM" 
                className="w-full glass-dark border border-white/5 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-xs placeholder:text-white/5" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full glass-dark border border-white/5 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-primary transition-all font-black uppercase tracking-widest text-xs placeholder:text-white/5" 
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 shadow-xl group mt-10"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? 'Establish Connection' : 'Initialize Profile'} 
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 flex items-center gap-6">
          <div className="flex-grow h-px bg-white/5"></div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black">External Auth</span>
          <div className="flex-grow h-px bg-white/5"></div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6">
          <button 
            onClick={handleGoogleLogin}
            className="h-16 glass-dark rounded-2xl flex items-center justify-center gap-4 hover:bg-white/5 transition-all border border-white/5 group"
          >
            <Chrome size={20} className="text-white/20 group-hover:text-brand-primary transition-colors" /> 
            <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
          </button>
          <button className="h-16 glass-dark rounded-2xl flex items-center justify-center gap-4 hover:bg-white/5 transition-all border border-white/5 group">
            <Github size={20} className="text-white/20 group-hover:text-brand-primary transition-colors" /> 
            <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
          </button>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-brand-primary transition-colors"
          >
            {isLogin ? "New user? Create identity" : "Existing user? Access terminal"}
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/10">
          <ShieldCheck size={14} className="text-brand-primary" /> End-to-End Encrypted Session
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
