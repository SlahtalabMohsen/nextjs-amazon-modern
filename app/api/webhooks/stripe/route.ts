import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { sendPurchaseReceipt } from '@/emails'
import Order from '@/lib/db/models/order.model'
import { connectToDatabase } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err}` },
      { status: 400 }
    )
  }

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    const orderId = charge.metadata.orderId
    const email = charge.billing_details.email
    const pricePaidInCents = charge.amount
    await connectToDatabase()
    const order = await Order.findById(orderId).populate('user', 'email')
    if (order == null) {
      return NextResponse.json({ error: 'Order not found' }, { status: 400 })
    }

    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: event.id,
      status: 'COMPLETED',
      email_address: email!,
      pricePaid: (pricePaidInCents / 100).toFixed(2),
    }
    await order.save()
    try {
      await sendPurchaseReceipt({ order })
    } catch {
      // Email failure should not block webhook processing
    }
    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    })
  }
  return NextResponse.json({ received: true })
}
