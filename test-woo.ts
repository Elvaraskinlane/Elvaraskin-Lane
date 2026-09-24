import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
import { getProducts } from './src/lib/woocommerce';

async function main() {
  const rawProducts = await getProducts(50, {});
  if (!Array.isArray(rawProducts)) {
     console.log("Not an array!", rawProducts);
     return;
  }
  const catalogSummary = rawProducts
    .filter((p: any) => p.stock_status === "instock")
    .map((p: any) => {
      const cats = p.categories ? p.categories.map((c: any) => c.name).join(', ') : '';
      const shortDesc = p.short_description ? p.short_description.replace(/<[^>]*>?/gm, '').substring(0, 150).trim() : '';
      return `- **[${p.name}](/product/${p.slug})** | ₦${p.price} | Categories: ${cats} | Info: ${shortDesc}`;
    })
    .join('\n');
  console.log("Catalog length:", catalogSummary.length);
  console.log("Catalog:\n", catalogSummary.substring(0, 500));
}

main().catch(console.error);
