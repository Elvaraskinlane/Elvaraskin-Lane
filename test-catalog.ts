import { getProducts } from './src/lib/woocommerce';

async function main() {
  const rawProducts = await getProducts(50, {});
  const catalogSummary = rawProducts
    .filter((p: any) => p.stock_status === "instock")
    .map((p: any) => {
      const cats = p.categories ? p.categories.map((c: any) => c.name).join(', ') : '';
      const tags = p.tags ? p.tags.map((t: any) => t.name).join(', ') : '';
      const shortDesc = p.short_description ? p.short_description.replace(/<[^>]*>?/gm, '').substring(0, 150).trim() : '';
      return `- **[${p.name}](/product/${p.slug})** | ₦${p.price} | Categories: ${cats} | Tags: ${tags} | Info: ${shortDesc}`;
    })
    .join('\n');
  console.log("Catalog length:", catalogSummary.length);
  console.log("Catalog:\n", catalogSummary);
}

main().catch(console.error);
