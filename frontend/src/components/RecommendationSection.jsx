import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import API from '../services/api';
import { Sparkles } from 'lucide-react';

const RecommendationSection = ({ type = 'recommended', title = 'Recommended For You', currentCategory = '', onQuickView, onCompare, compareList = [] }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        let endpoint = '/products?limit=4';
        if (currentCategory) {
          endpoint = `/products?category=${currentCategory}&limit=4`;
        }
        const res = await API.get(endpoint);
        setProducts(res.data.products || res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [currentCategory, type]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10 font-inter">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-[#67E8F9]" />
        <h3 className="text-xl font-extrabold text-white">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onQuickView={onQuickView}
            onCompare={onCompare}
            isCompared={compareList.some((item) => item._id === product._id)}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;
