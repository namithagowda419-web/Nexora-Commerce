import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, ShieldCheck, Sparkles, Box, Flame } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-[#0F1021] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#7C3AED]/20 font-inter">
      {/* Animated Ambient Gradient Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#7C3AED]/25 rounded-full blur-[120px] pointer-events-none animate-blob-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF6B8A]/20 rounded-full blur-[120px] pointer-events-none animate-blob-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#67E8F9]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Text & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 bg-[#1B1C3A]/90 backdrop-blur-xl px-4 py-2 rounded-full border border-[#7C3AED]/40 text-[#67E8F9] text-xs font-semibold uppercase tracking-widest shadow-3d-glow">
            <Zap className="w-4 h-4 text-[#FF6B8A]" />
            <span>NEXORA Next-Gen E-Commerce</span>
          </div>

          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight">
            Shop Smarter. <br />
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#FF6B8A] to-[#67E8F9] bg-clip-text text-transparent">
              Live Better Every Day.
            </span>
          </h1>

          <p className="text-[#D8B4FE]/80 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-poppins">
            Explore 100+ top-rated products across Electronics, Fashion, Footwear, Beauty, Home & Kitchen, Furniture, Fitness, Books, Grocery, and Accessories with instant express dispatch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-gradient-nexora text-white font-bold px-8 py-4 rounded-2xl text-sm shadow-3d-glow"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop?category=electronics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#7C3AED]/40 hover:border-[#67E8F9] bg-[#1B1C3A]/60 hover:bg-[#1B1C3A] text-white font-semibold px-8 py-4 rounded-2xl transition text-sm backdrop-blur-md hover-cyan-glow"
            >
              <Box className="w-4 h-4 text-[#67E8F9]" />
              <span>Tech & Electronics</span>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
            <div className="flex flex-col items-center lg:items-start">
              <span className="font-extrabold text-2xl text-[#67E8F9]">100+</span>
              <span className="text-[11px] text-[#D8B4FE]/70">Verified Products</span>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="font-extrabold text-2xl text-[#FF6B8A]">10</span>
              <span className="text-[11px] text-[#D8B4FE]/70">Departments</span>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="font-extrabold text-2xl text-[#7C3AED]">24/7</span>
              <span className="text-[11px] text-[#D8B4FE]/70">Express Delivery</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Floating Interactive Product Highlight Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center"
        >
          <div className="relative w-full max-w-md animate-float">
            <div className="glass-panel-3d p-4 rounded-3xl border border-[#7C3AED]/40 relative overflow-hidden shadow-3d-glow">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
                alt="Sony Headphones"
                className="w-full h-80 object-cover rounded-2xl"
              />

              {/* Floating Glass Box Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0F1021]/90 backdrop-blur-xl p-4 rounded-2xl border border-[#7C3AED]/40 flex items-center justify-between text-white shadow-2xl">
                <div>
                  <span className="text-[10px] text-[#67E8F9] uppercase tracking-widest font-bold">Featured Tech</span>
                  <h4 className="font-bold text-sm">Sony WH-1000XM5 Wireless</h4>
                  <span className="text-xs text-[#FF6B8A] font-extrabold">$349 <span className="line-through text-gray-400 font-medium">$399</span></span>
                </div>
                <Link
                  to="/product/sony-wh1000xm5-wireless-headphones"
                  className="p-2.5 bg-gradient-to-r from-[#7C3AED] to-[#FF6B8A] text-white rounded-xl font-bold hover:scale-110 transition shadow-md"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
