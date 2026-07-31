import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 bg-plum-primary/10 text-plum-primary rounded-3xl flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="font-playfair font-bold text-6xl text-plum-primary">404</h1>
        <h2 className="font-playfair font-bold text-2xl text-charcoal dark:text-white">
          Page Not Found
        </h2>
        <p className="text-xs text-gray-400">
          The requested luxury creation or salon page does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-plum-rich text-white text-xs font-semibold px-6 py-3 rounded-xl shadow hover:bg-plum-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Maison Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
