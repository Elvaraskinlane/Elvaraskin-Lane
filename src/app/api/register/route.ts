import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, firstName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const wcUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers`;
    
    // Encode credentials for Basic Auth required by WC REST API
    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    const base64Credentials = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    const customerData = {
      email,
      password,
      first_name: firstName || "",
      username: email.split('@')[0], // Generate username from email
    };

    const registerResponse = await fetch(wcUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${base64Credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(customerData)
    });

    const data = await registerResponse.json();

    if (!registerResponse.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to create account in WooCommerce" }, 
        { status: registerResponse.status }
      );
    }

    return NextResponse.json({ success: true, customerId: data.id }, { status: 201 });

  } catch (error: any) {
    console.error("API Register Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
