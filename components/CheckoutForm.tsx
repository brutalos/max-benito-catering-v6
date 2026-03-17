'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { ShoppingBag, CreditCard, Truck, User, MapPin, Phone, Mail } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import AddressAutocomplete, { AddressResult } from './AddressAutocomplete';
import { Clock } from 'lucide-react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, totalPrice, totalItems, clearCart, scheduledDeliveryTime, setScheduledDeliveryTime } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasPackage = cart.some(item => item.isPackage);
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  
  const [addressData, setAddressData] = useState<AddressResult | null>(null);
  const [woltData, setWoltData] = useState<{
    promiseId: string;
    fee: number;
    eta: number;
  } | null>(null);
  
  const [calculatingWolt, setCalculatingWolt] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!addressData) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    setCalculatingWolt(true);
    setWoltData(null);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/wolt/promise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            street: addressData.street,
            city: addressData.city,
            post_code: addressData.postCode
          }),
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.is_binding) {
          setError(data.error || 'Delivery not available for this address');
          setCalculatingWolt(false);
          return;
        }

        setWoltData({
          promiseId: data.id,
          fee: data.price.amount / 100,
          eta: data.dropoff.eta_minutes
        });
      } catch (err) {
        setError('Failed to calculate delivery fee');
      } finally {
        setCalculatingWolt(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [addressData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !addressData || !woltData) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create order in DB
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount: totalPrice + woltData.fee,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          addressData,
          dropoffComment: customerData.comment,
          woltPromiseId: woltData.promiseId,
          deliveryFee: woltData.fee,
          scheduledDeliveryTime
        }),
      });
      
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || 'Failed to create order');

      // 2. Confirm payment
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
            }
          }
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setLoading(false);
      } else {
        setSuccess(true);
        clearCart();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-primary/5">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Truck className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-[3rem] font-medium uc mb-4">Order Confirmed!</h2>
        <p className="text-[1.8rem] text-primary/60 mb-12 max-w-md mx-auto">
          Thank you for your order. We are preparing your delicious food. You will receive a confirmation email shortly.
        </p>
        <a 
          href="/" 
          className="bg-primary text-white uc py-4 px-12 rounded-full font-medium hover:bg-accent transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  const finalTotal = totalPrice + (woltData?.fee || 0);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
      <div className="flex-[2] space-y-12">
        {/* Customer Information */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5">
          <div className="flex items-center gap-4 mb-8">
            <User className="w-8 h-8 text-primary" />
            <h2 className="text-[2.4rem] font-medium uc">Customer Info</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[1.4rem] font-bold uc text-primary/60 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                <input
                  required
                  type="text"
                  placeholder="Max Mustermann"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full bg-primary/5 border border-primary/10 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-[1.6rem]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[1.4rem] font-bold uc text-primary/60 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                <input
                  required
                  type="email"
                  placeholder="max@example.com"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="w-full bg-primary/5 border border-primary/10 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-[1.6rem]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[1.4rem] font-bold uc text-primary/60 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                <input
                  required
                  type="tel"
                  placeholder="+43 664 1234567"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="w-full bg-primary/5 border border-primary/10 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-[1.6rem]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Scheduled Delivery (for Catering) */}
        {hasPackage && (
          <section className="bg-accent/5 p-8 rounded-3xl border border-accent/20 my-12">
            <div className="flex items-center gap-4 mb-6">
              <Clock className="w-8 h-8 text-accent" />
              <h2 className="text-[2.4rem] font-medium uc text-accent">Scheduled Delivery</h2>
            </div>
            <p className="text-[1.6rem] text-primary/70 mb-6">
              Catering orders must be scheduled at least 24 hours in advance.
            </p>
            <div className="space-y-2">
              <label className="text-[1.4rem] font-bold uc text-accent/60 ml-1">Delivery Date & Time</label>
              <input
                required
                type="datetime-local"
                value={scheduledDeliveryTime || ''}
                onChange={(e) => setScheduledDeliveryTime(e.target.value)}
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                className="w-full bg-white border border-accent/20 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-[1.8rem]"
              />
            </div>
          </section>
        )}

        {/* Delivery Address */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5">
          <div className="flex items-center gap-4 mb-8">
            <MapPin className="w-8 h-8 text-primary" />
            <h2 className="text-[2.4rem] font-medium uc">Delivery Address</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[1.4rem] font-bold uc text-primary/60 ml-1">Search Address</label>
              <AddressAutocomplete
                placeholder="Start typing your address..."
                onSelect={(addr) => setAddressData(addr)}
                className="w-full"
              />
            </div>
            
            {addressData && (
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/20 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[1.6rem] text-primary">{addressData.formatted}</p>
                  <p className="text-[1.4rem] text-primary/60">Verified address for Wolt delivery</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[1.4rem] font-bold uc text-primary/60 ml-1">Delivery Instructions (Optional)</label>
              <textarea
                placeholder="Door code, floor, or where to leave the food..."
                value={customerData.comment}
                onChange={(e) => setCustomerData({ ...customerData, comment: e.target.value })}
                className="w-full bg-primary/5 border border-primary/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-[1.6rem] h-32 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className={`bg-white p-8 rounded-3xl shadow-sm border border-primary/5 transition-opacity ${(!addressData || !woltData) ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-4 mb-8">
            <CreditCard className="w-8 h-8 text-primary" />
            <h2 className="text-[2.4rem] font-medium uc">Payment Details</h2>
          </div>
          <PaymentElement />
        </section>
      </div>

      <div className="flex-1">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 sticky top-32">
          <h3 className="text-[2.4rem] font-medium uc mb-8">Order Summary</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-[1.8rem]">
              <span className="text-primary/60">Subtotal ({totalItems} items)</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[1.8rem]">
              <span className="text-primary/60">Delivery (Wolt)</span>
              {calculatingWolt ? (
                <span className="text-primary/30 animate-pulse">Calculating...</span>
              ) : woltData ? (
                <span className="text-accent font-medium">€{woltData.fee.toFixed(2)}</span>
              ) : (
                <span className="text-primary/30">Enter address</span>
              )}
            </div>
            {woltData && (
              <div className="text-[1.4rem] text-primary/40 text-right -mt-2">
                Estimated delivery in {woltData.eta} mins
              </div>
            )}
            <div className="h-px bg-primary/10 my-4"></div>
            <div className="flex justify-between text-[2.4rem] font-bold">
              <span>Total</span>
              <span className="text-accent">€{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[1.4rem] mb-6 border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || loading || !addressData || !woltData}
            className={`w-full py-5 px-8 rounded-full font-bold text-[1.8rem] uc flex items-center justify-center gap-3 transition-all ${
              (!stripe || loading || !addressData || !woltData)
                ? 'bg-primary/10 text-primary/30 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-accent shadow-lg shadow-primary/10 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                Pay €{finalTotal.toFixed(2)}
              </>
            )}
          </button>
          
          <p className="text-center text-[1.4rem] text-primary/40 mt-6 leading-relaxed">
            Secure checkout powered by Stripe. <br />
            Delivery handled by Wolt Drive.
          </p>
        </div>
      </div>
    </form>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
