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
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // If token is valid, use Server-Side WooCommerce Consumer Keys to fetch orders by email
    const wcUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders?customer=${encodeURIComponent(email)}`;
    
    // We encode credentials for Basic Auth required by WC REST API
    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    const base64Credentials = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    const ordersResponse = await fetch(wcUrl, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${base64Credentials}`,
        "Content-Type": "application/json"
      }
    });

    const ordersData = await ordersResponse.json();

    if (!ordersResponse.ok) {
      return NextResponse.json({ message: "Failed to fetch orders from WooCommerce" }, { status: ordersResponse.status });
    }

    return NextResponse.json({ orders: ordersData }, { status: 200 });

  } catch (error: any) {
    console.error("API Orders Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
