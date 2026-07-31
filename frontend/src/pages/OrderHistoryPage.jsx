import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, Ban } from 'lucide-react';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import InvoiceModal from '../components/InvoiceModal';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const { addToast } = useToast();

  const fetchMyOrders = async () => {
    try {
      const res = await API.get('/orders/myorders');
      setOrders(res.data || []);
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you wish to cancel this order?')) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      addToast('Order cancelled successfully.', 'info');
      fetchMyOrders();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to cancel order.', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-lilac-soft dark:border-darkbg-border pb-6">
        <h1 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
          My Order History
        </h1>
        <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
          Track current shipments and view historical invoices.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center font-playfair text-xl text-plum-primary">Loading Orders...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-darkbg-card rounded-3xl p-6 border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-4"
            >
              <div className="flex flex-wrap justify-between items-center border-b border-lilac-soft/60 pb-4 gap-2">
                <div>
                  <span className="font-playfair font-bold text-sm text-plum-primary">#{order.orderNumber}</span>
                  <p className="text-xs text-gray-400">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                  <span className="font-playfair font-bold text-base text-charcoal dark:text-white">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="divide-y">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold text-charcoal dark:text-white">{item.title}</p>
                        <p className="text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-600 dark:text-gray-300">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-lilac-soft/40 gap-4">
                <button
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-plum-primary dark:text-lavender-soft hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>

                {order.status === 'Processing' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:underline font-medium"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-darkbg-card rounded-3xl border border-lilac-soft space-y-4">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-playfair font-bold text-xl">No Orders Found</h3>
          <p className="text-xs text-gray-400">You have not placed any orders with Veloura yet.</p>
          <Link to="/shop" className="inline-block bg-plum-primary text-white text-xs font-semibold px-6 py-3 rounded-xl shadow">
            Explore Catalogue
          </Link>
        </div>
      )}

      {selectedInvoiceOrder && (
        <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </div>
  );
};

export default OrderHistoryPage;
