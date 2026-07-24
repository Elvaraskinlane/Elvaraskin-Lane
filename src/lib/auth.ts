export const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://shop.elvaraskinlane.ng";
export const JWT_URL = `${WP_URL}/wp-json/jwt-auth/v1`;
export const WC_REST_URL = `${WP_URL}/wp-json/wc/v3`;

// Keys for WooCommerce REST API (Needed for Order Fetching if using consumer keys, though usually JWT token is passed)
// If we use JWT token to access WC endpoints, we pass Authorization: Bearer <token>.
// However, the WC REST API requires the user to be an admin to list *all* orders. 
// To list just their own orders, a customer needs the `read_private_shop_orders` capability, or we hit `/wp-json/wc/v3/orders?customer={id}` with their JWT.

export async function loginCustomer(username: string, password: string) {
  try {
    const response = await fetch(`${JWT_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // 1. Guard against non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { success: false, error: "Invalid email or password" };
    }

    // 2. Safely parse the JSON payload
    const data = await response.json();

    // 3. Catch HTTP error statuses
    if (!response.ok) {
      return { success: false, error: "Invalid email or password" };
    }

    // 4. Success state
    return { success: true, data };
  } catch (error: any) {
    // 5. Absolute fallback
    console.error("Login Exception:", error);
    return { success: false, error: "Invalid email or password" };
  }
}

export async function registerCustomer(email: string, password?: string, firstName?: string) {
  try {
    const response = await fetch('/api/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, firstName })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register account.");
    }

    return data;
  } catch (error: any) {
    console.error("Register Error:", error);
    throw error;
  }
}

export async function fetchCustomerOrders(token: string, email: string) {
  try {
    // Since we don't have the explicit customer ID immediately upon JWT login (JWT returns email, display name),
    // we can query WooCommerce orders by customer email.
    // We will use the Admin consumer keys securely via a Next.js Server Action to proxy this request,
    // OR hit a custom endpoint. Let's try fetching via the standard WooCommerce Store API /wp-json/wc/store/v1/orders
    // wait, the Store API doesn't list orders.
    // We must hit the server route or proxy to safely use WC_CONSUMER_KEY to query orders by email.
    
    const response = await fetch(`/api/orders?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(data.message || "Failed to fetch orders.");
    }

    return data.orders || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}
