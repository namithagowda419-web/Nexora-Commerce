import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Truck, RefreshCw, Award, Users, Globe, Flame } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-[#0F1021] min-h-screen text-white font-inter py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#1B1C3A] px-4 py-2 rounded-full border border-[#7C3AED]/40 text-[#67E8F9] text-xs font-bold uppercase tracking-widest shadow-3d-glow">
            <Zap className="w-4 h-4 text-[#FF6B8A]" />
            <span>NEXORA Marketplace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Shop Smarter. Live Better.
          </h1>
          <p className="text-sm text-[#D8B4FE] max-w-2xl mx-auto leading-relaxed">
            NEXORA is a multi-department online marketplace serving 50,000+ happy shoppers with express fulfillment across Electronics, Apparel, Shoes, Skincare, Home Essentials, Furniture, Fitness Gear, Books, Gourmet Grocery, and Accessories.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel-3d rounded-3xl p-6 text-center space-y-3 border border-[#7C3AED]/30 shadow-3d-glow">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#67E8F9]">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Express Fulfillment</h3>
            <p className="text-xs text-[#D8B4FE]/80 leading-relaxed">
              Same-day packing & express courier dispatch guarantees on-time delivery.
            </p>
          </div>

          <div className="glass-panel-3d rounded-3xl p-6 text-center space-y-3 border border-[#7C3AED]/30 shadow-3d-glow">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#FF6B8A]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Verified Brand Quality</h3>
            <p className="text-xs text-[#D8B4FE]/80 leading-relaxed">
              Every item is inspected and sourced directly from official manufacturers.
            </p>
          </div>

          <div className="glass-panel-3d rounded-3xl p-6 text-center space-y-3 border border-[#7C3AED]/30 shadow-3d-glow">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#67E8F9]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">30-Day Money Back</h3>
            <p className="text-xs text-[#D8B4FE]/80 leading-relaxed">
              Hassle-free 30-day return policy with instant buyer refund guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
