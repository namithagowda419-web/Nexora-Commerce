import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderKanban, X } from 'lucide-react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import AdminLayout from '../components/AdminLayout';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setImage('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setImage(cat.image);
    setDescription(cat.description);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, { name, image, description });
        addToast('Category updated.', 'success');
      } else {
        await API.post('/categories', { name, image, description });
        addToast('New category created.', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save category.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      addToast('Category removed.', 'info');
      fetchCategories();
    } catch (e) {
      addToast('Failed to delete category.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
              Department Categories
            </h1>
            <p className="text-xs text-gray-400">Manage category departments and banners.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-plum-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white dark:bg-darkbg-card p-4 rounded-3xl border border-lilac-soft shadow-luxury flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={cat.image} alt={cat.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <h4 className="font-playfair font-bold text-sm text-charcoal dark:text-white">{cat.name}</h4>
                  <p className="text-[10px] text-gray-400">{cat.productCount || 0} Products</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(cat)} className="p-2 hover:bg-gray-100 rounded-lg text-plum-primary">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-darkbg-card rounded-3xl max-w-md w-full p-6 space-y-4 border border-lilac-soft shadow-luxury">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-playfair font-bold text-lg">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-cream-warm border border-lilac-soft p-3 rounded-xl"
              />
              <input
                type="text"
                placeholder="Banner Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="w-full bg-cream-warm border border-lilac-soft p-3 rounded-xl"
              />
              <textarea
                placeholder="Short Description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-cream-warm border border-lilac-soft p-3 rounded-xl"
              />
              <button type="submit" className="w-full bg-plum-primary text-white font-bold p-3 rounded-xl shadow">
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
