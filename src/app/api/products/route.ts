import { NextResponse } from "next/server";
import { getProductsByIds, searchProducts } from "@/lib/woocommerce";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const include = searchParams.get("include");
  const search = searchParams.get("search");

  try {
    if (search) {
      const products = await searchProducts(search);
      return NextResponse.json(products);
    }

    if (!include) {
      return NextResponse.json({ error: "Missing include or search parameter" }, { status: 400 });
    }

    const ids = include.split(",").map(Number).filter(id => !isNaN(id));

    if (ids.length === 0) {
      return NextResponse.json({ error: "Invalid include parameter" }, { status: 400 });
    }

    const products = await getProductsByIds(ids);
    return NextResponse.json(products);
  } catch (error) {
    console.error("API error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
