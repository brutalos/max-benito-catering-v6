import React from 'react';
import { CheckCircle, Truck, ShoppingBag } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-zinc-50/50">
      <div className="row">
        <div className="max-w-3xl mx-auto bg-white p-12 md:p-20 rounded-3xl shadow-sm border border-primary/5 text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-[4rem] md:text-[5rem] font-medium uc mb-6">Payment Successful!</h1>
          <p className="text-[2rem] text-primary/60 mb-12 leading-relaxed">
            Your order has been placed successfully. Our team is starting to prepare your meal, and a Wolt courier will be dispatched shortly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-primary/5 rounded-2xl flex items-center gap-4 text-left">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <p className="font-bold text-[1.6rem]">Wolt Delivery</p>
                <p className="text-[1.4rem] text-primary/60">Real-time tracking available soon</p>
              </div>
            </div>
            <div className="p-6 bg-primary/5 rounded-2xl flex items-center gap-4 text-left">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <p className="font-bold text-[1.6rem]">Confirmation</p>
                <p className="text-[1.4rem] text-primary/60">Sent to your email address</p>
              </div>
            </div>
          </div>
          <a 
            href="/" 
            className="inline-block bg-primary text-white uc py-5 px-12 rounded-full font-bold text-[1.8rem] hover:bg-accent transition-all shadow-lg shadow-primary/10"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
