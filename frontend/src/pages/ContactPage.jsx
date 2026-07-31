import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ContactPage = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Your message has been received by our Maison Concierge.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-plum-primary">Bespoke Advisory</span>
        <h1 className="font-playfair font-bold text-4xl text-charcoal dark:text-white">
          Contact Our Concierge
        </h1>
        <p className="text-xs text-gray-500">
          Book a private viewing appointment or inquire about custom high jewelry commissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Card */}
        <div className="lg:col-span-5 bg-plum-rich text-white p-8 rounded-3xl space-y-6 shadow-luxury">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-lavender-soft" />
            <h3 className="font-playfair font-bold text-xl">Private Flagship</h3>
          </div>

          <div className="space-y-4 text-xs text-cream-warm/90">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-lavender-soft flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold">New York Salon</p>
                <p>740 Park Avenue, Apt 12B, New York, NY 10021</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-lavender-soft flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold">Client Support Line</p>
                <p>+1 (800) 987-LUMINA</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-lavender-soft flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold">Direct Email</p>
                <p>concierge@lumina.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-lavender-soft flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold">Salon Hours</p>
                <p>Mon - Sat: 10:00 AM - 7:00 PM EST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-darkbg-card p-8 rounded-3xl border border-lilac-soft shadow-luxury">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-cream-warm dark:bg-darkbg-input border border-lilac-soft p-3 rounded-xl"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-cream-warm dark:bg-darkbg-input border border-lilac-soft p-3 rounded-xl"
              />
            </div>

            <input
              type="text"
              placeholder="Subject / Inquired Creation"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft p-3 rounded-xl"
            />

            <textarea
              placeholder="How may our concierge assist you?"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft p-3 rounded-xl"
            />

            <button
              type="submit"
              className="w-full bg-plum-rich hover:bg-plum-primary text-white font-semibold py-3.5 rounded-xl shadow flex items-center justify-center gap-2 transition"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
