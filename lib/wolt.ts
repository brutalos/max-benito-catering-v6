// lib/wolt.ts

const WOLT_DRIVE_API_KEY = process.env.WOLT_DRIVE_API_KEY;
const WOLT_DRIVE_VENUE_ID = process.env.WOLT_DRIVE_VENUE_ID;
const BASE_URL = process.env.WOLT_DRIVE_BASE_URL || 'https://daas-public-api.development.dev.woltapi.com';

export interface WoltPromise {
  id: string;
  created_at: string;
  valid_until: string;
  pickup: {
    venue_id: string;
    location: { coordinates: { lat: number; lon: number }; formatted_address: string };
    eta_minutes: number;
  };
  dropoff: {
    location: { coordinates: { lat: number; lon: number }; formatted_address: string };
    eta_minutes: number;
  };
  price: { amount: number; currency: string };
  is_binding: boolean;
}

export interface WoltDelivery {
  id: string;
  status: string;
  tracking: { id: string; url: string };
  wolt_order_reference_id: string;
  merchant_order_reference_id: string;
  pickup: { eta: string };
  dropoff: { eta: string };
  price: { amount: number; currency: string };
}

export async function getShipmentPromise(params: {
  street: string;
  city: string;
  post_code: string;
  min_preparation_time_minutes?: number;
  scheduled_dropoff_time?: string;
  parcels?: Array<{
    count: number;
    dimensions?: { weight_gram?: number; width_cm?: number; height_cm?: number; depth_cm?: number };
    price?: { amount: number; currency: string };
  }>;
}): Promise<WoltPromise> {
  if (!WOLT_DRIVE_API_KEY) throw new Error('WOLT_DRIVE_API_KEY is missing');
  if (!WOLT_DRIVE_VENUE_ID) throw new Error('WOLT_DRIVE_VENUE_ID is missing');

  const response = await fetch(
    `${BASE_URL}/v1/venues/${WOLT_DRIVE_VENUE_ID}/shipment-promises`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WOLT_DRIVE_API_KEY}`,
      },
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Wolt Promise error ${response.status}: ${err}`);
  }

  return response.json();
}

export async function createDelivery(params: {
  shipment_promise_id: string;
  merchant_order_reference_id: string;
  order_number?: string;
  recipient: { name: string; phone_number: string; email?: string };
  dropoff: {
    location: {
      coordinates: { lat: number; lon: number };
    };
    comment?: string;
    options?: { is_no_contact?: boolean };
  };
  parcels: Array<{
    count: number;
    description?: string;
    identifier?: string;
    dimensions?: { weight_gram?: number };
  }>;
  customer_support: { email: string; phone_number?: string };
}): Promise<WoltDelivery> {
  if (!WOLT_DRIVE_API_KEY) throw new Error('WOLT_DRIVE_API_KEY is missing');
  if (!WOLT_DRIVE_VENUE_ID) throw new Error('WOLT_DRIVE_VENUE_ID is missing');

  const response = await fetch(
    `${BASE_URL}/v1/venues/${WOLT_DRIVE_VENUE_ID}/deliveries`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WOLT_DRIVE_API_KEY}`,
      },
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Wolt Delivery error ${response.status}: ${err}`);
  }

  return response.json();
}
