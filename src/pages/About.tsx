import React from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Sparkles, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="px-6 py-32 max-w-7xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8"
        >
          We Create <br /> <span className="text-gradient">Stickers</span> For <br /> Every Mood.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-xl max-w-2xl mx-auto"
        >
          GlowStuck was born out of a simple idea: your laptop is a canvas, and your stickers are your voice.
        </motion.p>
      </section>

      {/* Story */}
      <section className="px-6 py-20 bg-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-square glass rounded-[4rem] overflow-hidden"
          >
            <img src="https://picsum.photos/seed/about/800/800" alt="Our Story" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Our Story</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              Founded in 2024, GlowStuck started in a small garage with a single vinyl cutter and a passion for design. We noticed that most laptop stickers were either boring or low-quality. We wanted something better.
            </p>
            <p className="text-white/60 leading-relaxed text-lg">
              Today, we're a team of 15 designers and creators based in Mumbai, shipping thousands of stickers worldwide every month. Our mission remains the same: to help you express your unique personality through high-quality art.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <h4 className="text-4xl font-black text-brand-primary">10K+</h4>
                <p className="text-sm text-white/40 uppercase tracking-widest font-bold">Happy Customers</p>
              </div>
              <div>
                <h4 className="text-4xl font-black text-brand-primary">500+</h4>
                <p className="text-sm text-white/40 uppercase tracking-widest font-bold">Unique Designs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-center mb-20">What We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Heart size={32} />, title: "Passion", desc: "Every design is crafted with love and attention to detail." },
            { icon: <Users size={32} />, title: "Community", desc: "We listen to our community and build what they love." },
            { icon: <Sparkles size={32} />, title: "Quality", desc: "Only the best vinyl and inks touch our stickers." },
            { icon: <Globe size={32} />, title: "Sustainability", desc: "We're moving towards eco-friendly packaging." },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-3xl text-center"
            >
              <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                {value.icon}
              </div>
              <h4 className="text-xl font-bold mb-4 uppercase tracking-tighter">{value.title}</h4>
              <p className="text-sm text-white/50 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
