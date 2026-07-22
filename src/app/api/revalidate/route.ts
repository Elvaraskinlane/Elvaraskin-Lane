import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  // Verify secret token to prevent unauthorized cache purges
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body.slug; // Extract slug sent from WooCommerce webhook

    if (slug) {
      revalidatePath(`/product/${slug}`);
      revalidatePath(`/shop`); // Optional: revalidate shop page to show new product
      revalidatePath(`/`);     // Optional: revalidate homepage if featured
      return NextResponse.json({ revalidated: true, now: Date.now(), slug });
    }

    return NextResponse.json({ revalidated: false, message: 'No slug provided' });
  } catch (error) {
    console.error('Webhook payload error:', error);
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}
