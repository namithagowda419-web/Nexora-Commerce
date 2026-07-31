import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Search, Image as ImageIcon } from 'lucide-react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';

const AdminProducts = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const CATEGORIES = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Shoes', slug: 'shoes' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Furniture', slug: 'furniture' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
    { name: 'Grocery', slug: 'grocery' },
    { name: 'Accessories', slug: 'accessories' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    discountPrice: '',
    category: 'electronics',
    brand: '',
    stock: 10,
    images: '',
    description: '',
    isFeatured: false,
    isFlashSale: false,
    isTrending: false
  });

  const fetchAdminProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products?limit=100');
      setProducts(res.data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      price: '',
      discountPrice: '',
      category: 'electronics',
      brand: '',
      stock: 10,
      images: '',
      description: '',
      isFeatured: false,
      isFlashSale: false,
      isTrending: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      images: Array.isArray(product.images) ? product.images.join(', ') : product.images,
      description: product.description,
      isFeatured: !!product.isFeatured,
      isFlashSale: !!product.isFlashSale,
      isTrending: !!product.isTrending
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        addToast('Product deleted from inventory', 'info');
        fetchAdminProducts();
      } catch (e) {
        addToast('Failed to delete product', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
      stock: Number(formData.stock),
      images: formData.images.split(',').map((img) => img.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        addToast('Product updated successfully', 'success');
      } else {
        await API.post('/products', payload);
        addToast('New product created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchAdminProducts();
    } catch (e) {
      addToast(e.response?.data?.message || 'Error saving product', 'error');
    }
  };

  return (
    <div className="bg-[#0F1021] min-h-screen text-white font-inter py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#67E8F9] uppercase tracking-widest">NEXORA Admin Control</span>
            <h1 className="text-3xl font-extrabold text-white">Inventory Management</h1>
            <p className="text-xs text-[#D8B4FE]">Manage products, prices, stock and promotional flags</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="btn-gradient-nexora text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Product Table */}
        <div className="glass-panel-3d rounded-3xl border border-[#7C3AED]/30 overflow-hidden shadow-3d-glow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#0F1021] text-[#67E8F9] uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Flags</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/5 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.images?.[0]} alt={p.title} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold block text-xs">{p.title}</span>
                        <span className="text-[10px] text-gray-400">{p.brand}</span>
                      </div>
                    </td>
                    <td className="p-4 capitalize">{p.categoryName || p.category}</td>
                    <td className="p-4 font-bold text-[#67E8F9]">{formatCurrency(p.discountPrice || p.price)}</td>
                    <td className="p-4">{p.stock} units</td>
                    <td className="p-4">
                      <div className="flex gap-1 text-[9px] font-bold">
                        {p.isFeatured && <span className="bg-[#7C3AED]/40 text-[#67E8F9] px-2 py-0.5 rounded-full">Featured</span>}
                        {p.isFlashSale && <span className="bg-[#FF6B8A]/40 text-[#FF6B8A] px-2 py-0.5 rounded-full">Flash</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenEditModal(p)} className="p-1.5 bg-[#1B1C3A] text-[#67E8F9] hover:bg-[#7C3AED] hover:text-white rounded-lg">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="p-1.5 bg-[#1B1C3A] text-rose-400 hover:bg-rose-950 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1021]/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#1B1C3A] rounded-3xl border border-[#7C3AED]/40 p-6 text-white space-y-4 shadow-3d-glow max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-bold text-base">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#D8B4FE]">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#D8B4FE]">Original Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#D8B4FE]">Discount Price ($)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#D8B4FE]">Department</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-2 text-white capitalize"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#D8B4FE]">Brand</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#D8B4FE]">Image URL</label>
                <input
                  type="text"
                  required
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-[#D8B4FE]">Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#67E8F9]">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B8A]">
                  <input
                    type="checkbox"
                    checked={formData.isFlashSale}
                    onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                  />
                  <span>Flash Sale</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 rounded-xl text-xs text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-nexora text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
