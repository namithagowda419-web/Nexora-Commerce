import React from 'react';
import { Zap, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const FAQS = [
    {
      q: 'What is NEXORA?',
      a: 'NEXORA is a modern 3D tech e-commerce platform offering 100+ top quality products across 10 categories including Electronics, Fashion, Shoes, Beauty, Home & Kitchen, Furniture, Sports, Books, Grocery, and Accessories.'
    },
    {
      q: 'How fast is express shipping?',
      a: 'Orders placed before 2:00 PM EST are dispatched same-day. Free standard shipping applies to all orders over $50.'
    },
    {
      q: 'What is the return policy?',
      a: 'NEXORA offers a hassle-free 30-day money-back return policy on all items.'
    },
    {
      q: 'Which payment methods are accepted?',
      a: 'We accept major credit cards (Visa, MasterCard, Amex), Apple Pay, and Cash on Delivery.'
    }
  ];

  return (
    <div className="bg-[#0F1021] min-h-screen text-white font-inter py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#1B1C3A] px-4 py-2 rounded-full border border-[#7C3AED]/40 text-[#67E8F9] text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-4 h-4 text-[#FF6B8A]" />
            <span>NEXORA Help Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glass-panel-3d rounded-2xl p-6 border border-[#7C3AED]/30 space-y-2">
              <h3 className="font-bold text-base text-white">{faq.q}</h3>
              <p className="text-xs text-[#D8B4FE]/80 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
