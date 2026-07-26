import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecret) {
      console.error("PAYSTACK_SECRET_KEY is not configured.");
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }

    // Verify the webhook signature
    const hash = crypto.createHmac("sha512", paystackSecret).update(rawBody).digest("hex");
    if (hash !== signature) {
      console.error("Paystack webhook signature verification failed.");
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // We only care about successful charges
    if (payload.event === "charge.success") {
      const data = payload.data;
      
      // Extract the order_id from the custom_fields metadata we passed during initialization
      const customFields = data.metadata?.custom_fields || [];
      const orderIdField = customFields.find((f: any) => f.variable_name === "order_id");
      
      if (!orderIdField || !orderIdField.value) {
        console.error("Webhook received but no order_id found in metadata:", data.metadata);
        return NextResponse.json({ message: "No order_id found" }, { status: 200 });
      }

      const orderId = orderIdField.value;

      // Update WooCommerce order status to processing
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
          transaction_id: data.reference, // Store the Paystack reference in WooCommerce
        }),
      });

      const wcData = await wcRes.json();

      if (!wcRes.ok) {
        console.error(`Failed to update WooCommerce order ${orderId} via webhook:`, wcData);
        // Attempt to add a failure note
        try {
          await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders/${orderId}/notes?consumer_key=${wcKey}&consumer_secret=${wcSecret}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ note: `Paystack Webhook received but failed to update order status. Error: ${JSON.stringify(wcData)}` })
          });
        } catch(e) {}
        return NextResponse.json({ message: "Failed to update order" }, { status: 500 });
      }

      // Add a success note
      try {
        await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders/${orderId}/notes?consumer_key=${wcKey}&consumer_secret=${wcSecret}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: `Paystack Webhook successfully triggered and updated order to processing.` })
        });
      } catch(e) {}

      console.log(`Successfully updated order ${orderId} to processing via Paystack webhook.`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Paystack Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
