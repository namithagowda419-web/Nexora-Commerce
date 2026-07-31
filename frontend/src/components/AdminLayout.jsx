import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, FolderKanban, Users, Shield, ArrowLeft } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const links = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products Management', path: '/admin/products', icon: Package },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Categories', path: '/admin/categories', icon: FolderKanban },
    { label: 'Registered Clients', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-darkbg-card rounded-3xl p-6 border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-lilac-soft/60">
              <Shield className="w-5 h-5 text-plum-primary" />
              <h3 className="font-playfair font-bold text-lg text-charcoal dark:text-white">Admin Control</h3>
            </div>

            <nav className="flex flex-col gap-1.5">
              {links.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                      active
                        ? 'bg-plum-primary text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-cream-warm dark:hover:bg-darkbg-input'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-lilac-soft/60">
              <Link to="/" className="flex items-center gap-2 text-xs text-mauve-dusty hover:text-plum-primary">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Store</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Page Content */}
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
