"use server";

import { getProducts } from "@/lib/woocommerce";
import { WCProduct } from "@/types/woocommerce";

export async function loadMoreProductsAction(
  page: number, 
  searchParams?: { [key: string]: string | string[] | undefined }
): Promise<WCProduct[]> {
  try {
    const params = searchParams ? { ...searchParams, page: page.toString() } : { page: page.toString() };
    const newProducts = await getProducts(24, params);
    return newProducts;
  } catch (error) {
    console.error("Failed to load more products in server action:", error);
    return [];
  }
}
