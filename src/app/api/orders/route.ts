import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const authHeader = request.headers.get("Authorization");

    if (!email || !authHeader) {
      return NextResponse.json({ message: "Unauthorized or missing email" }, { status: 401 });
    }

    // Verify the JWT token by hitting a protected WP endpoint (like /wp-json/wp/v2/users/me)
    const verifyToken = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
      },
    });

    if (!verifyToken.ok) {
      const errorText = await verifyToken.text();
      console.error("JWT Verification failed:", verifyToken.status, errorText);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // If token is valid, use Server-Side WooCommerce Consumer Keys to fetch orders
    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    
    // Fetch Orders by Email (this works for both Guest orders and registered Customer orders)
    const wcUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders?search=${encodeURIComponent(email)}&consumer_key=${wcKey}&consumer_secret=${wcSecret}`;
    
    const ordersResponse = await fetch(wcUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const ordersData = await ordersResponse.json();

    if (!ordersResponse.ok) {
      console.error("WooCommerce Orders API failed:", ordersResponse.status, ordersData);
      return NextResponse.json({ message: "Failed to fetch orders from WooCommerce", details: ordersData }, { status: ordersResponse.status });
    }

    return NextResponse.json({ orders: ordersData }, { status: 200 });

  } catch (error: any) {
    console.error("API Orders Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
