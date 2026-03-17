'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import StripeProvider from '@/components/StripeProvider';
import CheckoutForm from '@/components/CheckoutForm';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CheckoutPageContent() {
  const { cart, totalPrice } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length === 0) return;

    const amount = Math.round(totalPrice * 100);
    if (isNaN(amount) || amount <= 0) return;

    fetch('/api/checkout/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice }),
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setError(data.error || 'Failed to initialize payment');
          }
        } else {
          throw new Error('Server returned an invalid response format.');
        }
      })
      .catch((err) => {
        console.error('Payment intent error:', err);
        setError(err.message || 'Failed to initialize payment');
      });
  }, [cart.length, totalPrice]);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-primary/5 p-8 rounded-full mb-8">
          <ShoppingBag className="w-16 h-16 text-primary/20" />
        </div>
        <h2 className="text-[3rem] font-medium uc mb-4">Your cart is empty</h2>
        <a 
          href="/#food" 
          className="bg-primary text-white uc py-4 px-12 rounded-full font-medium hover:bg-accent transition-colors flex items-center gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 text-[2rem]">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 bg-primary text-white uc py-3 px-8 rounded-full"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-6" />
        <p className="text-[1.8rem] text-primary/60 uc font-medium">Initializing secure checkout...</p>
      </div>
    );
  }

  return (
    <StripeProvider clientSecret={clientSecret || ''}>
      <div className="row">
        <div className="mb-12">
          <a href="/cart" className="inline-flex items-center gap-2 text-[1.6rem] text-primary/60 hover:text-accent transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </a>
          <h1 className="text-[4rem] md:text-[6rem] font-medium uc">Checkout</h1>
        </div>
        <CheckoutForm />
      </div>
    </StripeProvider>
  );
}
