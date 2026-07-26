import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...value] = line.split('=');
    if (key && value) acc[key.trim()] = value.join('=').trim().replace(/^['\"]|['\"]$/g, '');
  }
  return acc;
}, {});

const storeUrl = `${env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/store/v1`;

async function run() {
  try {
    // 1. Get a cart token
    const cartRes = await fetch(`${storeUrl}/cart`);
    const cartToken = cartRes.headers.get("Cart-Token");
    console.log("Cart Token:", cartToken);

    // 2. Add item to cart
    const addRes = await fetch(`${storeUrl}/cart/add-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cart-Token": cartToken },
      body: JSON.stringify({ id: 180, quantity: 1 }) // Use an arbitrary product ID like 180
    });
    console.log("Add Item Status:", addRes.status);
    
    // 3. Checkout with create_account: true for an existing email (e.g. mrovoxo07@gmail.com)
    const checkoutRes = await fetch(`${storeUrl}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cart-Token": cartToken },
      body: JSON.stringify({
        billing_address: { email: "mrovoxo07@gmail.com", first_name: "Test", last_name: "User", city: "City", postcode: "000", address_1: "Address", country: "NG" },
        shipping_address: { email: "mrovoxo07@gmail.com", first_name: "Test", last_name: "User", city: "City", postcode: "000", address_1: "Address", country: "NG" },
        payment_method: "paystack",
        create_account: true
      })
    });
    console.log("Checkout Status:", checkoutRes.status);
    const checkoutData = await checkoutRes.json();
    console.log("Checkout Response:", checkoutData);
  } catch (err) {
    console.error(err);
  }
}

run();
