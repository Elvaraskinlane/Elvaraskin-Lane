import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify token and get WordPress User ID
    const wpUserResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
      },
    });

    if (!wpUserResponse.ok) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const wpUser = await wpUserResponse.json();
    const customerId = wpUser.id;

    // 2. Fetch full Customer Profile from WooCommerce
    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    const base64Credentials = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers/${customerId}`, {
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

    return NextResponse.json({ customer: customerData }, { status: 200 });

  } catch (error: any) {
    console.error("API GET Account Settings Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const body = await request.json();

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify token and get WordPress User ID
    const wpUserResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
      },
    });

    if (!wpUserResponse.ok) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const wpUser = await wpUserResponse.json();
    const customerId = wpUser.id;

    // 2. Update Customer Profile in WooCommerce
    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    const base64Credentials = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    // Only allow updating specific fields for security
    const updatePayload: any = {
      first_name: body.first_name,
      last_name: body.last_name,
      billing: body.billing
    };

    // WordPress requires a separate way to update passwords usually, but WooCommerce customer endpoint supports it!
    if (body.password && body.password.trim() !== "") {
      updatePayload.password = body.password;
    }

    const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers/${customerId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Basic ${base64Credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatePayload)
    });

    if (!customerResponse.ok) {
      const errorData = await customerResponse.json();
      return NextResponse.json({ message: errorData.message || "Failed to update customer data" }, { status: customerResponse.status });
    }

    const updatedCustomer = await customerResponse.json();

    return NextResponse.json({ customer: updatedCustomer }, { status: 200 });

  } catch (error: any) {
    console.error("API PUT Account Settings Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
