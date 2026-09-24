import { NextResponse } from "next/server";
import { getProducts } from "@/lib/woocommerce";
import { toAssistantProduct } from "@/lib/assistant-catalog";

export async function GET() {
  try {
    const products = await getProducts(100);
    const catalog = products
      .filter((product) => product.stock_status === "instock")
      .map(toAssistantProduct);

    return NextResponse.json(catalog);
  } catch (error) {
    console.error("Assistant catalog error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
