// Use the Next.js rewrite proxy to bypass CORS on the client
const WC_STORE_URL = `/api/store`;

// Utility to get the current cart session token from the browser
function getCartToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("wc_cart_token") || "";
  }
  return "";
}

// Utility to save a new token if WooCommerce generates one
function saveCartToken(response: Response) {
  const token = response.headers.get("Cart-Token");
  if (token && typeof window !== "undefined") {
    localStorage.setItem("wc_cart_token", token);
  }
}

/**
 * Fetch the current user's cart
 */
export async function getCart() {
  const response = await fetch(`${WC_STORE_URL}/cart`, {
    method: "GET",
    headers: {
      "Cart-Token": getCartToken(),
    },
  });
  
  saveCartToken(response);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch cart");
  }
  
  return response.json();
}

/**
 * Add an item to the cart
 */
export async function addToCart(productId: number, quantity: number = 1) {
  const response = await fetch(`${WC_STORE_URL}/cart/add-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cart-Token": getCartToken(),
    },
    body: JSON.stringify({
      id: productId,
      quantity,
    }),
  });

  saveCartToken(response);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add item to cart");
  }
  
  return response.json();
}

/**
 * Remove an item from the cart using its unique cart item key
 */
export async function removeFromCart(itemKey: string) {
  const response = await fetch(`${WC_STORE_URL}/cart/remove-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cart-Token": getCartToken(),
    },
    body: JSON.stringify({
      key: itemKey,
    }),
  });

  saveCartToken(response);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to remove item from cart");
  }
  
  return response.json();
}

/**
 * Update the quantity of an item in the cart
 */
export async function updateCartItem(itemKey: string, quantity: number) {
  const response = await fetch(`${WC_STORE_URL}/cart/update-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cart-Token": getCartToken(),
    },
    body: JSON.stringify({
      key: itemKey,
      quantity,
    }),
  });

  saveCartToken(response);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update cart item");
  }
  
  return response.json();
}

/**
 * Process the checkout form and generate an order
 */
export async function processCheckout(checkoutData: any) {
  // Extract custom fields not meant for address data
  const { createAccount, password, ...addressDataRaw } = checkoutData;

  const addressData = {
    ...addressDataRaw,
    postcode: addressDataRaw.postcode || "000000",
  };

  const payload = {
    billing_address: addressData,
    shipping_address: addressData, // WooCommerce requires a shipping address for physical goods
    payment_method: "paystack",
    create_account: !!createAccount,
    ...(createAccount && password ? { password, account_password: password } : {}),
  };

  // Get user auth token if logged in, so order is linked to their account
  let authHeader = {};
  try {
    const { useAuthStore } = require("@/store/useAuthStore");
    const token = useAuthStore.getState().token;
    if (token) {
      authHeader = { "Authorization": `Bearer ${token}` };
    }
  } catch (e) {
    console.error("Failed to get auth token for checkout");
  }

  const response = await fetch(`${WC_STORE_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cart-Token": getCartToken(),
      ...authHeader,
    },
    body: JSON.stringify(payload),
  });

  // WooCommerce returns 201 Created on success
  if (!response.ok) {
    const errorData = await response.json();
    let errorMessage = errorData.message || "Failed to process checkout";
    
    // Check if there are specific validation details
    if (errorData.data && errorData.data.details) {
      const details = Object.entries(errorData.data.details)
        .map(([field, error]: [string, any]) => `${field}: ${error.message}`)
        .join(", ");
      errorMessage += ` (${details})`;
    }
    
    throw new Error(errorMessage);
  }

  saveCartToken(response);
  return response.json();
}
