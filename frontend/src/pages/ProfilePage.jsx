import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Key, Camera, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [address, setAddress] = useState({
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    zipCode: user?.addresses?.[0]?.zipCode || ''
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const payload = {
      name,
      email,
      phone,
      avatar,
      address
    };

    if (password) payload.password = password;
    await updateProfile(payload);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-lilac-soft dark:border-darkbg-border pb-6">
        <h1 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
          Client Profile Settings
        </h1>
        <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
          Manage your contact credentials, avatar, and preferred delivery addresses.
        </p>
      </div>

      <div className="bg-white dark:bg-darkbg-card rounded-3xl p-6 sm:p-8 border border-lilac-soft dark:border-darkbg-border shadow-luxury">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="relative">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-plum-primary shadow-md"
              />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-lg text-charcoal dark:text-white">{user?.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 bg-plum-primary/10 text-plum-primary font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" /> {user?.role || 'user'} Account
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
            </div>
          </div>

          {/* Address Fields */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-playfair font-bold text-sm text-charcoal dark:text-white">Delivery Address</h4>
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                className="bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
            </div>
          </div>

          {/* Password Change */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-playfair font-bold text-sm text-charcoal dark:text-white">Security & Password</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="New Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-plum-rich hover:bg-plum-primary text-white text-xs font-semibold px-8 py-3.5 rounded-2xl shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
