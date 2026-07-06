import { WCProduct } from "@/types/woocommerce";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

export async function getProducts(perPage: number = 12): Promise<WCProduct[]> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    console.warn("Missing WooCommerce environment variables, returning empty array.");
    return [];
  }

  const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=${perPage}&status=publish`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CONSUMER_KEY}:${CONSUMER_SECRET}`
        ).toString("base64")}`,
      },
      next: {
        revalidate: 60, // Revalidate every minute
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch products from WooCommerce:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data as WCProduct[];
  } catch (error) {
    console.error("Error fetching WooCommerce products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    return null;
  }

  const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?slug=${slug}&status=publish`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CONSUMER_KEY}:${CONSUMER_SECRET}`
        ).toString("base64")}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.length > 0 ? (data[0] as WCProduct) : null;
  } catch (error) {
    console.error(`Error fetching WooCommerce product ${slug}:`, error);
    return null;
  }
}

export async function getProductsByIds(ids: number[]): Promise<WCProduct[]> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET || ids.length === 0) {
    return [];
  }

  const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?include=${ids.join(',')}&status=publish`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CONSUMER_KEY}:${CONSUMER_SECRET}`
        ).toString("base64")}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("Failed to fetch products by ids:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data as WCProduct[];
  } catch (error) {
    console.error("Error fetching WooCommerce products by ids:", error);
    return [];
  }
}

export async function getProductsByCategorySlug(slug: string): Promise<WCProduct[]> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    return [];
  }

  try {
    // 1. Fetch category ID by slug
    const catUrl = `${WORDPRESS_URL}/wp-json/wc/v3/products/categories?slug=${slug}`;
    const catResponse = await fetch(catUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`,
      },
      next: { revalidate: 3600 }, // Categories change rarely
    });

    if (!catResponse.ok) return [];
    
    const categories = await catResponse.json();
    if (categories.length === 0) return [];

    const categoryId = categories[0].id;

    // 2. Fetch products by category ID
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?category=${categoryId}&status=publish&per_page=24`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data as WCProduct[];
  } catch (error) {
    console.error(`Error fetching WooCommerce products for category ${slug}:`, error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<WCProduct[]> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET || !query) {
    return [];
  }

  const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?search=${encodeURIComponent(query)}&status=publish&per_page=24`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("Failed to search products:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data as WCProduct[];
  } catch (error) {
    console.error("Error searching WooCommerce products:", error);
    return [];
  }
}
