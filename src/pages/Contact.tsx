import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6">Get In <span className="text-gradient">Touch</span></h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto">Have a custom request or just want to say hi? We're all ears.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-10 rounded-[3rem]"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Name</label>
                <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Email</label>
                <input type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Subject</label>
              <input type="text" placeholder="What's this about?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Message</label>
              <textarea rows={5} placeholder="Your message here..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary resize-none"></textarea>
            </div>
            <button className="w-full h-16 bg-brand-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all active:scale-95">
              Send Message <Send size={18} />
            </button>
          </form>
        </motion.div>

        {/* Info */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">Email Us</p>
                  <p className="text-xl font-bold">hello@stickwithmood.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">Call Us</p>
                  <p className="text-xl font-bold">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">Visit Us</p>
                  <p className="text-xl font-bold">Design District, Mumbai, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xl mb-2">Need instant help?</h4>
              <p className="text-sm text-white/50">Chat with us on WhatsApp for quick support.</p>
            </div>
            <a href="#" className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </a>
          </div>

          {/* Map Placeholder */}
          <div className="h-64 glass rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15083.14304823485!2d72.8258!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c92f39149731%3A0x3d699a2b306a028!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
