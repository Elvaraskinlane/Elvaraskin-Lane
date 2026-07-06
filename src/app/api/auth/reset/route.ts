import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { key, login, new_password } = await request.json();

    if (!key || !login || !new_password) {
      return NextResponse.json({ message: "Missing required parameters." }, { status: 400 });
    }

    const wcKey = process.env.WC_CONSUMER_KEY || "";
    const wcSecret = process.env.WC_CONSUMER_SECRET || "";
    const base64Credentials = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

    // We will build this custom endpoint in the WordPress plugin later
    const response = await fetch(`${wpUrl}/wp-json/elvara/v1/reset-password`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${base64Credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ key, login, new_password })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Failed to reset password." }, { status: response.status });
    }

    return NextResponse.json({ message: "Password reset successful." }, { status: 200 });
  } catch (error: any) {
    console.error("API Reset Password Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
