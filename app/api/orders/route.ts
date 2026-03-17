import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { 
      items, 
      totalAmount, 
      customerName, 
      customerEmail, 
      customerPhone,
      addressData,
      dropoffComment,
      woltPromiseId,
      deliveryFee,
      scheduledDeliveryTime
    } = await req.json();

    const order = await prisma.order.create({
      data: {
        totalAmount,
        customerName,
        customerEmail,
        customerPhone,
        customerStreet: addressData?.street,
        customerCity: addressData?.city,
        customerPostCode: addressData?.postCode,
        customerLat: addressData?.lat,
        customerLon: addressData?.lon,
        dropoffComment,
        woltPromiseId,
        deliveryFee,
        scheduledDeliveryTime: scheduledDeliveryTime ? new Date(scheduledDeliveryTime) : null,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.isPackage ? item.id.split('-')[0] : item.id,
            quantity: item.quantity,
            price: item.price,
            options: JSON.stringify(item.isPackage ? { packageSelections: item.packageSelections } : (item.selectedOptions || {})),
          })),
        },
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
