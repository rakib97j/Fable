import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.BETTER_AUTH_URL || 'http://localhost:3000'

    const body = await req.json()
    const { ebookId, title, price, coverImage, description, userId, userEmail } = body

    if (!ebookId) {
      return NextResponse.json(
        { error: 'E-book ID is required' },
        { status: 400 }
      )
    }

    const priceNum = parseFloat(price) || 0
    if (priceNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid price for paid e-book' },
        { status: 400 }
      )
    }

    // Amount in cents
    const unitAmount = Math.round(priceNum * 100)

    // Build image array if valid image provided
    const images = coverImage && typeof coverImage === 'string' && coverImage.startsWith('http')
      ? [coverImage]
      : []

    const sessionPayload = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title || 'Fable E-Book',
              description: description ? description.slice(0, 250) : 'Digital E-book on Fable',
              images: images,
              metadata: {
                ebookId: String(ebookId),
              },
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&ebook_id=${ebookId}`,
      cancel_url: `${origin}/e-books/${ebookId}?canceled=true`,
      metadata: {
        ebookId: String(ebookId),
        userId: String(userId || ''),
        userEmail: String(userEmail || ''),
      },
    }

    if (userEmail && typeof userEmail === 'string' && userEmail.includes('@')) {
      sessionPayload.customer_email = userEmail.trim()
    }

    const session = await stripe.checkout.sessions.create(sessionPayload)

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe Checkout Error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: err.statusCode || 500 }
    )
  }
}