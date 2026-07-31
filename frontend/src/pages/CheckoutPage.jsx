import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { formatCurrency } from '../utils/formatters';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discountAmount, shippingCharges, taxAmount, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Eleanor Vance',
    address: user?.addresses?.[0]?.street || '740 Park Avenue, Apt 12B',
    city: user?.addresses?.[0]?.city || 'New York',
    state: user?.addresses?.[0]?.state || 'NY',
    zipCode: user?.addresses?.[0]?.zipCode || '10021',
    country: 'United States',
    phone: user?.phone || '+1 (555) 123-4567'
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Stripe Simulator)');

  // Card Inputs
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
    nameOnCard: user?.name || 'Eleanor Vance'
  });

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
      addToast('Please complete all required shipping fields.', 'error');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => {
          const p = item.productData || item.product;
          return {
            product: p._id || p,
            title: p.title,
            price: p.discountPrice > 0 ? p.discountPrice : p.price,
            image: p.image || p.images?.[0],
            quantity: item.quantity,
            selectedColor: item.selectedColor || '',
            selectedSize: item.selectedSize || ''
          };
        }),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: taxAmount,
        shippingPrice: shippingCharges,
        discountAmount,
        totalPrice: totalAmount
      };

      let res;
      if (user?.token) {
        res = await API.post('/orders', orderData);
      } else {
        // Guest mode simulated response
        res = {
          data: {
            _id: 'guest-' + Date.now(),
            orderNumber: 'LUM-' + Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toISOString(),
            ...orderData
          }
        };
      }

      // Confetti celebration animation!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast('Order placed successfully! Thank you.', 'success');
      clearCart();
      navigate(`/order-confirmation/${res.data._id}`, { state: { order: res.data } });
    } catch (error) {
      addToast(error.response?.data?.message || 'Error placing order.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-playfair font-bold text-2xl">No Items in Bag for Checkout</h2>
        <button onClick={() => navigate('/shop')} className="bg-plum-primary text-white text-xs font-semibold px-6 py-3 rounded-xl">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-lilac-soft dark:border-darkbg-border pb-6">
        <h1 className="font-playfair font-bold text-3xl sm:text-4xl text-charcoal dark:text-white">
          Secure Checkout
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-plum-primary' : 'text-gray-400'}`}>
            <span className="w-6 h-6 rounded-full bg-plum-primary text-white flex items-center justify-center text-[10px]">1</span>
            <span>Shipping Details</span>
          </div>
          <span className="text-gray-300">—</span>
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-plum-primary' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-plum-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
            <span>Payment & Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-7 bg-white dark:bg-darkbg-card rounded-3xl p-6 sm:p-8 border border-lilac-soft dark:border-darkbg-border shadow-luxury">
          {step === 1 ? (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <h3 className="font-playfair font-bold text-xl text-charcoal dark:text-white border-b pb-4">
                Shipping & Concierge Address
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  required
                  className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  required
                  className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                    className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">State / Region</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                    className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Postal / Zip Code</label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    required
                    className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                  <input
                    type="text"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    required
                    className="w-full bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-4 py-3 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-plum-rich hover:bg-plum-primary text-white font-semibold py-4 rounded-2xl shadow-luxury flex items-center justify-center gap-2 text-sm transition mt-6"
              >
                <span>Continue to Payment Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-playfair font-bold text-xl text-charcoal dark:text-white">
                  Payment Method Selection
                </h3>
                <button onClick={() => setStep(1)} className="text-xs text-plum-primary font-semibold hover:underline">
                  Edit Shipping Address
                </button>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'Credit Card (Stripe Simulator)' ? 'border-plum-primary bg-plum-primary/5 font-bold' : 'border-lilac-soft'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Credit Card (Stripe Simulator)'}
                      onChange={() => setPaymentMethod('Credit Card (Stripe Simulator)')}
                      className="accent-plum-primary"
                    />
                    <CreditCard className="w-5 h-5 text-plum-primary" />
                    <div>
                      <p className="text-xs font-semibold">Credit / Debit Card (Stripe)</p>
                      <p className="text-[10px] text-gray-400">Instant 256-bit encrypted authentication</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'Cash on Delivery' ? 'border-plum-primary bg-plum-primary/5 font-bold' : 'border-lilac-soft'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="accent-plum-primary"
                    />
                    <Banknote className="w-5 h-5 text-plum-primary" />
                    <div>
                      <p className="text-xs font-semibold">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-gray-400">Pay upon delivery by courier</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Card Inputs Simulation */}
              {paymentMethod.includes('Credit Card') && (
                <div className="bg-cream-warm dark:bg-darkbg-input p-4 rounded-2xl border border-lilac-soft space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-600">Simulated Card Details</span>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Test Card Ready</span>
                  </div>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    readOnly
                    className="w-full bg-white dark:bg-darkbg-card border border-lilac-soft text-xs px-3 py-2 rounded-xl font-mono"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardDetails.expDate}
                      readOnly
                      className="bg-white dark:bg-darkbg-card border border-lilac-soft text-xs px-3 py-2 rounded-xl font-mono"
                    />
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      readOnly
                      className="bg-white dark:bg-darkbg-card border border-lilac-soft text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-plum-rich hover:bg-plum-primary text-white font-semibold py-4 rounded-2xl shadow-luxury flex items-center justify-center gap-2 text-sm transition"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Processing Order...' : `Authorize & Complete Order (${formatCurrency(totalAmount)})`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Preview */}
        <div className="lg:col-span-5 bg-white dark:bg-darkbg-card rounded-3xl p-6 sm:p-8 border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-6">
          <h3 className="font-playfair font-bold text-xl text-charcoal dark:text-white border-b pb-4">
            Items in Order ({cartItems.length})
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const p = item.productData || item.product;
              const price = p.discountPrice > 0 ? p.discountPrice : p.price;
              return (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={p.image || p.images?.[0]} alt={p.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h5 className="font-semibold text-xs truncate max-w-[180px]">{p.title}</h5>
                    <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-playfair font-bold text-xs text-plum-primary">
                    {formatCurrency(price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-xs border-t pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Insured Shipping</span>
              <span>{shippingCharges === 0 ? 'Complimentary' : formatCurrency(shippingCharges)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (5%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-plum-primary pt-2 border-t">
              <span>Total Payment</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
