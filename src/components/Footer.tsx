import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 mb-6 group">
            SLAP<span className="text-brand-primary">IT</span>
            <div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center text-[8px] font-bold sticker-border -rotate-12">
              VIBE
            </div>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Slap some personality on your lid. Premium, waterproof, and zero-residue stickers for the modern vibe.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><Link to="/shop" className="hover:text-brand-primary transition-colors">All Stickers</Link></li>
            <li><Link to="/shop?category=Anime" className="hover:text-brand-primary transition-colors">Anime</Link></li>
            <li><Link to="/shop?category=Coding" className="hover:text-brand-primary transition-colors">Coding</Link></li>
            <li><Link to="/shop?category=Memes" className="hover:text-brand-primary transition-colors">Memes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><Link to="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Newsletter</h4>
          <p className="text-sm text-white/50 mb-4">Subscribe to get special offers and first look at new drops.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-primary"
            />
            <button className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
        <p>© 2026 StickWithMood. All rights reserved.</p>
        <div className="flex gap-6">
          <span>Designed with ❤️ by AIS</span>
          <span>Made in India</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
