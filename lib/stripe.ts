import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY || '';

if (!key) {
  console.warn('Stripe API key is not set');
}

export const stripe = new Stripe(key);
