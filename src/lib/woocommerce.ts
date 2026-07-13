import { WCProduct } from "@/types/woocommerce";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

export async function getProducts(
  perPage: number = 12,
  searchParams?: { [key: string]: string | string[] | undefined }
): Promise<WCProduct[]> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    console.warn("Missing WooCommerce environment variables, returning empty array.");
    return [];
  }

  let url = `${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=${perPage}&status=publish`;

  try {
    if (searchParams) {
      if (searchParams.page) {
        url += `&page=${searchParams.page}`;
      }
      if (searchParams.search) {
        url += `&search=${encodeURIComponent(searchParams.search as string)}`;
      }
      if (searchParams.orderby) {
        url += `&orderby=${searchParams.orderby}`;
      }
      if (searchParams.order) {
        url += `&order=${searchParams.order}`;
      }

      // Helper to fetch and match multiple slugs
      const matchSlugsToIds = async (endpoint: string, slugs: string[], matchField: string = "slug") => {
        const res = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products/${endpoint}`, {
          headers: { Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}` },
          next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const items = await res.json();
        return items
          .filter((item: any) => slugs.includes(item[matchField]))
          .map((item: any) => item.id);
      };

      // Map category slug(s) to ID(s)
      if (searchParams.category && typeof searchParams.category === "string") {
        const slugs = searchParams.category.split(',').filter(Boolean);
        if (slugs.length > 0) {
          const ids = await matchSlugsToIds('categories?per_page=100', slugs);
          if (ids.length > 0) {
            url += `&category=${ids.join(',')}`;
          } else {
            return []; // No matching categories found
          }
        }
      }

      // Map concern (tag) slug(s) to ID(s)
      if (searchParams.concern && typeof searchParams.concern === "string") {
        const slugs = searchParams.concern.split(',').filter(Boolean);
        if (slugs.length > 0) {
          const ids = await matchSlugsToIds('tags?per_page=100', slugs);
          if (ids.length > 0) {
            url += `&tag=${ids.join(',')}`;
          } else {
            return []; // No matching tags found
          }
        }
      }

      // Map brand (attribute pa_brand) slug(s) to ID(s)
      if (searchParams.brand && typeof searchParams.brand === "string") {
        const slugs = searchParams.brand.split(',').filter(Boolean);
        if (slugs.length > 0) {
          const attrRes = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products/attributes`, {
            headers: { Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}` },
            next: { revalidate: 3600 }
          });
          
          if (attrRes.ok) {
            const attributes = await attrRes.json();
            const brandAttr = attributes.find((a: any) => a.slug === "pa_brand");
            
            if (brandAttr) {
              const ids = await matchSlugsToIds(`attributes/${brandAttr.id}/terms?per_page=100`, slugs);
              if (ids.length > 0) {
                url += `&attribute=pa_brand&attribute_term=${ids.join(',')}`;
              } else {
                return []; // No matching brand terms found
              }
            } else {
              return []; // pa_brand attribute not found
            }
          } else {
            return [];
          }
        }
      }
    }

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
