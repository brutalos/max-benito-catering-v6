import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getShipmentPromise, createDelivery } from '@/lib/wolt';

// E.164 phone validation
function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Load order from DB with items (for rich parcels)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        items: { 
          include: { 
            product: true 
          } 
        } 
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { 
      customerStreet, 
      customerCity, 
      customerPostCode,
      customerName, 
      customerPhone, 
      dropoffComment,
      scheduledDeliveryTime,
      totalAmount
    } = order;

    if (!customerStreet || !customerCity || !customerPostCode) {
      return NextResponse.json({ error: 'Order missing address fields (street, city, post_code required)' }, { status: 400 });
    }

    if (customerPhone && !isValidE164(customerPhone)) {
      return NextResponse.json(
        { error: 'Phone must be E.164 format (e.g. +436641234567)' },
        { status: 400 }
      );
    }

    // 1. Get fresh shipment promise (old ones expire)
    const promiseParams: any = {
      street: customerStreet,
      city: customerCity,
      post_code: customerPostCode,
      parcels: [{
        count: order.items.length || 1,
        dimensions: {
          weight_gram: order.items.reduce((sum, i) => sum + (i.quantity * 500), 0),
        },
        price: { amount: Math.round(totalAmount * 100), currency: 'EUR' },
      }],
    };

    if (scheduledDeliveryTime) {
      promiseParams.scheduled_dropoff_time = scheduledDeliveryTime.toISOString();
      promiseParams.min_preparation_time_minutes = 15;
    }

    const promise = await getShipmentPromise(promiseParams);

    if (!promise.is_binding) {
      return NextResponse.json(
        { error: 'Address is outside Wolt delivery area' },
        { status: 422 }
      );
    }

    // 2. Build rich parcels from order items
    const itemDescription = order.items
      .map(i => `${i.quantity}x ${i.product.name}`)
      .join(', ')
      .slice(0, 100);

    // 3. Create delivery
    const delivery = await createDelivery({
      shipment_promise_id: promise.id,
      merchant_order_reference_id: orderId,
      order_number: orderId.slice(-5).toUpperCase(),
      recipient: {
        name: customerName || 'Customer',
        phone_number: customerPhone || '',
      },
      dropoff: {
        location: {
          coordinates: promise.dropoff.location.coordinates,
        },
        comment: dropoffComment || undefined,
      },
      parcels: [{
        count: order.items.length || 1,
        description: itemDescription || 'Order ' + orderId,
        identifier: orderId.slice(-5).toUpperCase(),
        dimensions: {
          weight_gram: order.items.reduce((sum, i) => sum + (i.quantity * 500), 0),
        },
      }],
      customer_support: {
        email: process.env.STORE_SUPPORT_EMAIL || 'support@example.com',
        ...(process.env.STORE_SUPPORT_PHONE ? { phone_number: process.env.STORE_SUPPORT_PHONE } : {}),
      },
    });

    // 4. Update order in DB
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        woltOrderRefId: delivery.wolt_order_reference_id,
        woltTrackingUrl: delivery.tracking.url,
        status: 'DISPATCHED',
        deliveryStatus: delivery.status,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Dispatch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
