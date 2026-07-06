import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { items } = await request.json();

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify the JWT token and get the user ID
    const verifyToken = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
      },
    });

    if (!verifyToken.ok) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userData = await verifyToken.json();
    const customerId = userData.id;

    if (!customerId) {
      return NextResponse.json({ message: "Failed to identify customer" }, { status: 400 });
    }

    // 2. Use Server-Side WooCommerce Consumer Keys to update the customer's meta_data
    const wcUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers/${customerId}`;
    
    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    const base64Credentials = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    const updateResponse = await fetch(wcUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Basic ${base64Credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        meta_data: [
          {
            key: "_elvara_wishlist",
            value: JSON.stringify(items) // Store as JSON string inside meta
          }
        ]
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to sync wishlist to WooCommerce" }, 
        { status: updateResponse.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("API Wishlist Sync Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify the JWT token and get the user ID
    const verifyToken = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
      },
    });

    if (!verifyToken.ok) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userData = await verifyToken.json();
    const customerId = userData.id;

    if (!customerId) {
      return NextResponse.json({ message: "Failed to identify customer" }, { status: 400 });
    }

    // 2. Use Server-Side WooCommerce Consumer Keys to fetch the customer's meta_data
    const wcUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers/${customerId}`;
    
    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    const base64Credentials = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    const customerResponse = await fetch(wcUrl, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${base64Credentials}`,
        "Content-Type": "application/json"
      }
    });

    if (!customerResponse.ok) {
      return NextResponse.json({ message: "Failed to fetch customer data" }, { status: customerResponse.status });
    }

    const customerData = await customerResponse.json();
    
    // Find the wishlist meta
    const wishlistMeta = customerData.meta_data?.find((meta: any) => meta.key === "_elvara_wishlist");
    let items = [];
    
    if (wishlistMeta && wishlistMeta.value) {
      try {
        items = typeof wishlistMeta.value === 'string' ? JSON.parse(wishlistMeta.value) : wishlistMeta.value;
      } catch (e) {
        console.error("Failed to parse wishlist meta", e);
      }
    }

    return NextResponse.json({ items }, { status: 200 });

  } catch (error: any) {
    console.error("API Wishlist Fetch Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
