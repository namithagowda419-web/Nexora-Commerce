import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Send, ShieldCheck, Truck, RefreshCw, Award, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      addToast('Thank you for subscribing to NEXORA Flash Deals.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#080914] text-white border-t border-[#7C3AED]/20 font-inter pt-16 pb-8">
      {/* Brand Values Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-2xl">
            <Truck className="w-6 h-6 text-[#67E8F9]" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Free Express Shipping</h4>
            <p className="text-xs text-[#D8B4FE]/80">On orders over $50 nationwide</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-[#67E8F9]" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Buyer Protection</h4>
            <p className="text-xs text-[#D8B4FE]/80">100% money-back guarantee</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-2xl">
            <RefreshCw className="w-6 h-6 text-[#67E8F9]" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Easy 30-Day Returns</h4>
            <p className="text-xs text-[#D8B4FE]/80">Hassle-free replacement policy</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-2xl">
            <Award className="w-6 h-6 text-[#67E8F9]" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Authentic Guarantee</h4>
            <p className="text-xs text-[#D8B4FE]/80">Verified brands & top seller quality</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Brand Story */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#FF6B8A] flex items-center justify-center shadow-3d-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-white">NEXORA</span>
              <span className="text-[9px] font-semibold text-[#67E8F9] tracking-wider -mt-1">Shop Smarter. Live Better.</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[#D8B4FE]/90 max-w-sm">
            NEXORA is your modern online shopping marketplace for Electronics, Fashion, Shoes, Beauty, Home & Kitchen, Furniture, Sports, Books, Grocery, and Accessories.
          </p>

          {/* Newsletter */}
          <div className="pt-2">
            <h5 className="font-bold text-sm mb-2">Subscribe to NEXORA Newsletter</h5>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm">
              <input
                type="email"
                placeholder="Enter email for flash deals"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1B1C3A] text-white placeholder-[#D8B4FE]/50 px-4 py-2.5 rounded-l-2xl text-xs border border-[#7C3AED]/40 focus:outline-none focus:border-[#67E8F9]"
              />
              <button
                type="submit"
                className="btn-gradient-nexora text-white font-bold px-4 py-2.5 rounded-r-2xl text-xs flex items-center gap-1"
              >
                <span>Join</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Column 1: Top Departments */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm tracking-wider text-[#67E8F9] uppercase">Departments</h4>
          <ul className="space-y-2 text-xs text-[#D8B4FE]">
            <li><Link to="/shop?category=electronics" className="hover:text-white transition">Electronics</Link></li>
            <li><Link to="/shop?category=fashion" className="hover:text-white transition">Fashion & Apparel</Link></li>
            <li><Link to="/shop?category=shoes" className="hover:text-white transition">Shoes & Footwear</Link></li>
            <li><Link to="/shop?category=beauty" className="hover:text-white transition">Beauty & Skincare</Link></li>
            <li><Link to="/shop?category=home-kitchen" className="hover:text-white transition">Home & Kitchen</Link></li>
            <li><Link to="/shop?category=furniture" className="hover:text-white transition">Furniture</Link></li>
            <li><Link to="/shop?category=sports" className="hover:text-white transition">Sports & Fitness</Link></li>
          </ul>
        </div>

        {/* Column 2: Customer Help */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm tracking-wider text-[#67E8F9] uppercase">Customer Care</h4>
          <ul className="space-y-2 text-xs text-[#D8B4FE]">
            <li><Link to="/faq" className="hover:text-white transition">Help & FAQs</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">Order Tracking</Link></li>
            <li><Link to="/terms" className="hover:text-white transition">Terms & Privacy</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About NEXORA</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Support</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm tracking-wider text-[#67E8F9] uppercase">Contact Support</h4>
          <ul className="space-y-2.5 text-xs text-[#D8B4FE]">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#67E8F9] flex-shrink-0" />
              <span>740 Park Avenue, New York, NY</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#67E8F9] flex-shrink-0" />
              <span>+1 (800) 987-NEXORA</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#67E8F9] flex-shrink-0" />
              <span>support@nexora.com</span>
            </li>
          </ul>

          <div className="flex gap-3 pt-2">
            <a href="#instagram" className="p-2 bg-[#1B1C3A] rounded-full hover:bg-[#7C3AED] transition">
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a href="#facebook" className="p-2 bg-[#1B1C3A] rounded-full hover:bg-[#7C3AED] transition">
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a href="#twitter" className="p-2 bg-[#1B1C3A] rounded-full hover:bg-[#7C3AED] transition">
              <Twitter className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#D8B4FE]/70">
        <p>© 2026 NEXORA Inc. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-[#67E8F9]">Protected Payments:</span>
          <span className="px-2 py-1 bg-[#1B1C3A] rounded font-mono text-[10px] text-white">STRIPE</span>
          <span className="px-2.5 py-1 bg-[#1B1C3A] rounded font-mono text-[10px] text-white">VISA</span>
          <span className="px-2 py-1 bg-[#1B1C3A] rounded font-mono text-[10px] text-white">MASTERCARD</span>
          <span className="px-2 py-1 bg-[#1B1C3A] rounded font-mono text-[10px] text-white">COD</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
