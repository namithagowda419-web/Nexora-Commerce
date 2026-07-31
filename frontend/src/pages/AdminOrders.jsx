import React, { useState, useEffect } from 'react';
import { ShoppingBag, FileText, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import AdminLayout from '../components/AdminLayout';
import InvoiceModal from '../components/InvoiceModal';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      addToast(`Order #${orderId.slice(-6)} updated to "${status}"`, 'success');
      fetchOrders();
    } catch (error) {
      addToast('Failed to update order status.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
            Orders & Fulfillment Management
          </h1>
          <p className="text-xs text-gray-400">View customer orders, update tracking status, and inspect invoices.</p>
        </div>

        <div className="bg-white dark:bg-darkbg-card rounded-3xl border border-lilac-soft overflow-hidden shadow-luxury">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-warm dark:bg-darkbg-input text-gray-700 dark:text-gray-200 font-semibold">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Client</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-cream-warm/40 dark:hover:bg-darkbg-input/50 transition">
                  <td className="p-4">
                    <span className="font-bold text-plum-primary">#{o.orderNumber}</span>
                    <p className="text-[10px] text-gray-400">{formatDate(o.createdAt)}</p>
                  </td>
                  <td className="p-4 font-semibold">
                    {o.user?.name || o.shippingAddress?.fullName || 'Client'}
                  </td>
                  <td className="p-4 font-bold text-plum-primary">{formatCurrency(o.totalPrice)}</td>
                  <td className="p-4 text-[11px]">{o.paymentMethod}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1 rounded-full border focus:outline-none ${
                        o.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : o.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedInvoiceOrder(o)}
                      className="p-2 text-plum-primary hover:bg-cream-warm rounded-lg"
                      title="View Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoiceOrder && (
        <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
