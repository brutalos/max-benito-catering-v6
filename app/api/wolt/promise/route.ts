import { NextRequest, NextResponse } from 'next/server';
import { getShipmentPromise } from '@/lib/wolt';

export async function POST(req: NextRequest) {
  try {
    const { street, city, post_code } = await req.json();

    if (!street || !city || !post_code) {
      return NextResponse.json(
        { error: 'street, city, and post_code are required' },
        { status: 400 }
      );
    }

    const promise = await getShipmentPromise({
      street,
      city,
      post_code,
    });

    return NextResponse.json(promise);
  } catch (error: any) {
    console.error('Wolt Promise Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
