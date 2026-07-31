import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#0F1021] min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter text-white relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B8A]/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel-3d rounded-3xl p-8 border border-[#7C3AED]/40 shadow-3d-glow relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#FF6B8A] flex items-center justify-center shadow-3d-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">NEXORA</span>
          </Link>
          <h2 className="text-xl font-bold text-white">Create NEXORA Account</h2>
          <p className="text-xs text-[#D8B4FE]">Join 50,000+ happy shoppers today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#D8B4FE]">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-[#0F1021] text-white placeholder-gray-500 border border-[#7C3AED]/40 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-[#67E8F9]"
              />
              <User className="w-4 h-4 text-[#7C3AED] absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#D8B4FE]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0F1021] text-white placeholder-gray-500 border border-[#7C3AED]/40 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-[#67E8F9]"
              />
              <Mail className="w-4 h-4 text-[#7C3AED] absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#D8B4FE]">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0F1021] text-white placeholder-gray-500 border border-[#7C3AED]/40 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-[#67E8F9]"
              />
              <Lock className="w-4 h-4 text-[#7C3AED] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient-nexora text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#D8B4FE]">
          Already registered?{' '}
          <Link to="/login" className="text-[#67E8F9] font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
