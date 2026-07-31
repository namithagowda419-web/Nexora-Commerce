import React from 'react';
import { Printer, Download, X, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const InvoiceModal = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white text-gray-900 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#FF6B8A] flex items-center justify-center text-white font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-2xl tracking-tight text-gray-900">NEXORA</h2>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Official Order Invoice</p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button onClick={handlePrint} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1">
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-2 gap-4 py-6 border-b border-gray-200 text-xs">
          <div>
            <p className="text-gray-500 font-medium">Billed To:</p>
            <p className="font-bold text-gray-900">{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p>{order.shippingAddress?.country}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 font-medium">Invoice No:</p>
            <p className="font-bold text-[#7C3AED]">{order.orderNumber || order._id}</p>
            <p className="text-gray-500 mt-1">Date: {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
            <p className="font-semibold text-emerald-600">Status: {order.status || 'Paid'}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left text-xs py-4">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px]">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.orderItems?.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3 font-semibold text-gray-900">{item.title}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                <td className="py-3 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Summary */}
        <div className="border-t border-gray-200 pt-4 flex justify-end">
          <div className="w-48 space-y-1 text-xs text-right">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal:</span>
              <span>{formatCurrency(order.itemsPrice || order.totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax & Shipping:</span>
              <span>{formatCurrency((order.taxPrice || 0) + (order.shippingPrice || 0))}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-extrabold text-[#7C3AED]">
              <span>Total Paid:</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
