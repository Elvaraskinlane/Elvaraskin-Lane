import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { reference, orderId } = await request.json();

    if (!reference || !orderId) {
      return NextResponse.json({ message: "Missing reference or orderId" }, { status: 400 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error("PAYSTACK_SECRET_KEY is not configured.");
      return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
    }

    // 1. Verify with Paystack
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    // 2. Update WooCommerce order status
    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    
    // Using query parameters for WooCommerce Auth avoids Apache/LiteSpeed stripping the Authorization header
    const wcUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders/${orderId}?consumer_key=${wcKey}&consumer_secret=${wcSecret}`;

    const wcRes = await fetch(wcUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "processing", // Assuming successful payment means processing
      }),
    });

    const wcData = await wcRes.json();

    if (!wcRes.ok) {
      console.error("Failed to update WooCommerce order:", wcData);
      return NextResponse.json({ message: "Failed to update order status" }, { status: 500 });
    }

    return NextResponse.json({ message: "Payment verified and order updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Verify Payment Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
