import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
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
        const isAdmin = userCredential.user.email === "dhruvidhameliya01@gmail.com";
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
      const isAdmin = result.user.email === "dhruvidhameliya01@gmail.com";
      
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
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass p-10 rounded-[3rem]"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Vibe'}
          </h2>
          <p className="text-white/50 text-sm">
            {isLogin ? 'Log in to your SLAPIT account' : 'Create an account to start slapping'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary" 
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary" 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full h-14 bg-brand-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-grow h-px bg-white/10"></div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Or continue with</span>
          <div className="flex-grow h-px bg-white/10"></div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleLogin}
            className="h-14 glass rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
          >
            <Chrome size={20} /> <span className="text-sm font-bold">Google</span>
          </button>
          <button className="h-14 glass rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
            <Github size={20} /> <span className="text-sm font-bold">GitHub</span>
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-white/40">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-primary font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
