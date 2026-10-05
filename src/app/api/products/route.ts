import { NextResponse } from "next/server";
import { getProductsByIds, searchProducts } from "@/lib/woocommerce";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const include = searchParams.get("include");
  const search = searchParams.get("search");

  try {
    if (search) {
      let products = await searchProducts(search);
      let didYouMean = "";
      
      if (products.length === 0 && search.length > 2) {
        const { getAllBrands } = require("@/lib/woocommerce");
        const { getLevenshteinDistance } = require("@/lib/distance");
        
        const brands = await getAllBrands();
        let bestMatch = "";
        let minDistance = 3;

        brands.forEach((brand: any) => {
          let dist = getLevenshteinDistance(search.toLowerCase(), brand.name.toLowerCase());
          const words = brand.name.toLowerCase().split(/[\s-]+/);
          for (const word of words) {
            if (word.length > 3) {
              const wordDist = getLevenshteinDistance(search.toLowerCase(), word);
              if (wordDist < dist) dist = wordDist;
            }
          }
          if (dist < minDistance) {
            minDistance = dist;
            bestMatch = brand.name;
          }
        });

        if (bestMatch) didYouMean = bestMatch;
      }

      return NextResponse.json({ products, didYouMean });
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
