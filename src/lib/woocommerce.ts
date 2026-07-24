import { WCProduct } from "@/types/woocommerce";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

type WCTerm = {
  id: number;
  slug: string;
};

type WCAttribute = {
  id: number;
  slug: string;
};

function getAuthHeaders() {
  return {
    Authorization: `Basic ${Buffer.from(
      `${CONSUMER_KEY}:${CONSUMER_SECRET}`
    ).toString("base64")}`,
  };
}

function isWCTerm(value: unknown): value is WCTerm {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as WCTerm).id === "number" &&
    typeof (value as WCTerm).slug === "string"
  );
}

function isWCAttribute(value: unknown): value is WCAttribute {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as WCAttribute).id === "number" &&
    typeof (value as WCAttribute).slug === "string"
  );
}

async function matchSlugsToIds(endpoint: string, slugs: string[]) {
  const res = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products/${endpoint}`, {
    headers: getAuthHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const items: unknown = await res.json();
  if (!Array.isArray(items)) return [];

  return items
    .filter(isWCTerm)
    .filter((item) => slugs.includes(item.slug))
    .map((item) => item.id);
}

async function getBrandFilterQuery(slugs: string[]) {
  const brandIds = await matchSlugsToIds("brands?per_page=100", slugs);
  if (brandIds.length > 0) {
    return `&brand=${brandIds.join(",")}`;
  }

  const attrRes = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products/attributes`, {
    headers: getAuthHeaders(),
    next: { revalidate: 3600 },
  });

  if (!attrRes.ok) return null;

  const attributes: unknown = await attrRes.json();
  if (!Array.isArray(attributes)) return null;

  const brandAttr = attributes.filter(isWCAttribute).find((attribute) => attribute.slug === "pa_brand");
  if (!brandAttr) return null;

  const attributeTermIds = await matchSlugsToIds(`attributes/${brandAttr.id}/terms?per_page=100`, slugs);
  if (attributeTermIds.length === 0) return null;

  return `&attribute=pa_brand&attribute_term=${attributeTermIds.join(",")}`;
}

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
      if (searchParams.include) {
        url += `&include=${searchParams.include}`;
      }
      
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
          const brandQuery = await getBrandFilterQuery(slugs);
          if (!brandQuery) return [];
          url += brandQuery;
        }
      }
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
      next: {
        revalidate: 60, // Revalidate every minute
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch products from WooCommerce:", response.statusText);
      try {
        const fallback = require('./fallback-products.json');
        return fallback as WCProduct[];
      } catch (e) {
        return [];
      }
    }

    const data = await response.json();
    return data as WCProduct[];
  } catch (error) {
    console.error("Error fetching WooCommerce products:", error);
    try {
      const fallback = require('./fallback-products.json');
      return fallback as WCProduct[];
    } catch (e) {
      return [];
    }
  }
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    return null;
  }

  const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?slug=${slug}&status=publish`;

  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }, // Categories change rarely
    });

    if (!catResponse.ok) return [];
    
    const categories = await catResponse.json();
    if (categories.length === 0) return [];

    const categoryId = categories[0].id;

    // 2. Fetch products by category ID
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?category=${categoryId}&status=publish&per_page=24`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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

export async function getAllCategories(): Promise<{ id: number; name: string; slug: string; count: number; image?: string }[]> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) return [];
  const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/categories?per_page=100`;
  try {
    const response = await fetch(url, { headers: getAuthHeaders(), next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const categories = await response.json();
    
    // Fetch products to use as fallback thumbnails
    const products = await getProducts(100);
    
    return categories.map((cat: any) => {
      let image = cat.image?.src;
      if (!image) {
        // Fallback to first product in this category
        const prod = products.find(p => p.categories.some(c => c.id === cat.id) && p.images?.length > 0);
        if (prod) image = prod.images[0].src;
      }
      return { id: cat.id, name: cat.name.replace(/&amp;/g, '&'), slug: cat.slug, count: cat.count, image };
    });
  } catch (error) {
    console.error("Error fetching WooCommerce categories:", error);
    return [];
  }
}

export async function getAllTags(): Promise<{ id: number; name: string; slug: string; count: number; image?: string }[]> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) return [];
  const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/tags?per_page=100`;
  try {
    const response = await fetch(url, { headers: getAuthHeaders(), next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const tags = await response.json();
    
    // Fetch products to map thumbnails
    // Tags don't come back with products directly in the standard WCProduct response unless custom mapped.
    // However, since we don't have tags on WCProduct natively in our type, we'll fetch from WC directly.
    // Wait, Elvara products use tags! 
    // To make it fully reliable, we can use the tag endpoints, or simply return tags as they are for now,
    // and rely on a direct tag fetch if we want exact images. 
    // Let's fetch 100 products from WooCommerce natively and map them.
    const productsRes = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=100&status=publish`, { headers: getAuthHeaders(), next: { revalidate: 3600 } });
    const rawProducts = await productsRes.json();
    
    return tags.map((tag: any) => {
      const prod = rawProducts.find((p: any) => p.tags && p.tags.some((t: any) => t.id === tag.id) && p.images?.length > 0);
      return { id: tag.id, name: tag.name.replace(/&amp;/g, '&'), slug: tag.slug, count: tag.count, image: prod?.images[0]?.src };
    });
  } catch (error) {
    console.error("Error fetching WooCommerce tags:", error);
    return [];
  }
}

export async function getAllBrands(): Promise<{ id: number; name: string; slug: string; count: number; image?: string }[]> {
  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) return [];
  
  try {
    const brandsRes = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products/brands?per_page=100`, { headers: getAuthHeaders(), next: { revalidate: 3600 } });
    if (!brandsRes.ok) return [];
    const brands = await brandsRes.json();
    
    // Map thumbnails from products
    const productsRes = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=100&status=publish`, { headers: getAuthHeaders(), next: { revalidate: 3600 } });
    const rawProducts = await productsRes.json();
    
    return brands.map((brand: any) => {
      let image = brand.image?.src || brand.image;
      // In case the image field is empty or returned as an unexpected object structure
      if (!image || typeof image === 'object') {
        const prod = rawProducts.find((p: any) => p.brands && p.brands.some((b: any) => b.id === brand.id) && p.images?.length > 0);
        image = prod?.images[0]?.src;
      }
      return { id: brand.id, name: brand.name.replace(/&amp;/g, '&'), slug: brand.slug, count: brand.count, image };
    });
  } catch (error) {
    console.error("Error fetching WooCommerce brands:", error);
    return [];
  }
}
