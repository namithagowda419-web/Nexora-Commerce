import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, PackageCheck, FileText, ArrowRight, Clock, MapPin } from 'lucide-react';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import InvoiceModal from '../components/InvoiceModal';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await API.get(`/orders/${id}`);
          setOrder(res.data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return <div className="py-20 text-center font-playfair text-xl">Loading order confirmation...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="font-playfair text-2xl font-bold">Order Details Unavailable</h2>
        <Link to="/orders" className="bg-plum-primary text-white text-xs font-semibold px-6 py-3 rounded-xl">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-darkbg-card rounded-3xl p-8 border border-lilac-soft dark:border-darkbg-border shadow-luxury text-center space-y-4"
      >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
          Thank You For Your Order
        </h1>

        <p className="text-xs text-charcoal-muted dark:text-gray-300 max-w-md mx-auto">
          Your order reference <span className="font-bold text-plum-primary">#{order.orderNumber}</span> has been confirmed. A confirmation receipt has been dispatched.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => setShowInvoice(true)}
            className="flex items-center gap-2 bg-plum-rich hover:bg-plum-primary text-white text-xs font-semibold px-6 py-3 rounded-xl shadow transition"
          >
            <FileText className="w-4 h-4" />
            <span>View & Download Invoice</span>
          </button>

          <Link
            to="/orders"
            className="flex items-center gap-2 bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-charcoal dark:text-white text-xs font-semibold px-6 py-3 rounded-xl transition"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Track Order History</span>
          </Link>
        </div>
      </motion.div>

      {/* Delivery Tracking Progress Timeline */}
      <div className="bg-white dark:bg-darkbg-card rounded-3xl p-6 sm:p-8 border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-6">
        <h3 className="font-playfair font-bold text-lg text-charcoal dark:text-white border-b pb-4">
          Delivery Status Timeline
        </h3>

        <div className="grid grid-cols-3 gap-4 text-center relative">
          <div className="flex flex-col items-center space-y-2 z-10">
            <div className="w-10 h-10 rounded-full bg-plum-primary text-white flex items-center justify-center font-bold text-xs shadow-md">
              ✓
            </div>
            <span className="text-xs font-semibold text-charcoal dark:text-white">Order Confirmed</span>
            <span className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</span>
          </div>

          <div className="flex flex-col items-center space-y-2 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
              order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-plum-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="text-xs font-semibold text-charcoal dark:text-white">Insured Dispatch</span>
            <span className="text-[10px] text-gray-400">In Transit</span>
          </div>

          <div className="flex flex-col items-center space-y-2 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
              order.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-xs font-semibold text-charcoal dark:text-white">Delivered</span>
            <span className="text-[10px] text-gray-400">Estimated 3-5 Days</span>
          </div>
        </div>
      </div>

      {/* Invoice Modal Overlay */}
      {showInvoice && <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />}
    </div>
  );
};

export default OrderConfirmationPage;
