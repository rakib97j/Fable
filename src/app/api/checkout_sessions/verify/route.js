import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// In-memory set to prevent duplicate database posts for the same payment session
const recordedSessions = new Set()

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        paid: true,
        sessionId: session.id,
        ebookId: session.metadata?.ebookId || null,
        userId: session.metadata?.userId || null,
        customerEmail: session.customer_details?.email || session.metadata?.userEmail || null,
        amountTotal: session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00',
        currency: session.currency ? session.currency.toUpperCase() : 'USD',
        paymentMethod: session.payment_method_types?.[0] || 'card',
        status: session.payment_status,
        type: session.metadata?.type || 'ebook',
        createdAt: session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      paid: false,
      status: session.payment_status,
    })
  } catch (err) {
    console.error('Session Verification Error:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to verify session' },
      { status: 500 }
    )
  }
}
