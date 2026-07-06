import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    const base64Credentials = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

    // We will build this custom endpoint in the WordPress plugin later
    const response = await fetch(`${wpUrl}/wp-json/elvara/v1/forgot-password`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${base64Credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Failed to initiate password reset." }, { status: response.status });
    }

    return NextResponse.json({ message: "Reset link sent successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("API Forgot Password Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
