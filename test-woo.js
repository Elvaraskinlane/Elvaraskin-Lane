require('dotenv').config({ path: '.env.local' });
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

async function run() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const attrRes = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products/attributes`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  const attrs = await attrRes.json();
  console.log("Attributes:", attrs.map(a => ({ id: a.id, name: a.name, slug: a.slug })));
  
  const brandAttr = attrs.find(a => a.slug === 'pa_brand');
  if (brandAttr) {
    const termRes = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products/attributes/${brandAttr.id}/terms`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const terms = await termRes.json();
    console.log("Brand Terms:", terms.map(t => ({ id: t.id, name: t.name, slug: t.slug })));
  } else {
    console.log("pa_brand not found");
  }
}
run();
