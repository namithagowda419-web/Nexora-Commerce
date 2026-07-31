import React from 'react';

const TermsPage = () => {
  return (
    <div className="bg-[#0F1021] min-h-screen text-white font-inter py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 glass-panel-3d rounded-3xl p-8 border border-[#7C3AED]/30 shadow-3d-glow">
        <h1 className="text-2xl font-extrabold text-white">NEXORA Terms & Privacy Policy</h1>
        <p className="text-xs text-[#D8B4FE]">Last updated: 2026</p>

        <div className="space-y-4 text-xs text-[#D8B4FE]/90 leading-relaxed">
          <p>
            Welcome to NEXORA. By accessing or using our website, mobile interface, or purchasing products across our 10 departments, you agree to be bound by these Terms of Service.
          </p>

          <h3 className="font-bold text-sm text-white pt-2">1. User Accounts & Privacy</h3>
          <p>
            You are responsible for keeping your credentials secure. We respect your data privacy and will never sell or rent your personal contact information to unauthorized third parties.
          </p>

          <h3 className="font-bold text-sm text-white pt-2">2. Pricing & Orders</h3>
          <p>
            All prices listed on NEXORA are in USD ($). We reserve the right to modify prices or cancel orders in case of pricing errors or inventory stockouts.
          </p>

          <h3 className="font-bold text-sm text-white pt-2">3. Shipping & Returns</h3>
          <p>
            Standard orders process within 24 hours. Returns must be requested within 30 days of delivery in original condition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
