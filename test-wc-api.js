const wcKey = process.env.WC_CONSUMER_KEY || "";
const wcSecret = process.env.WC_CONSUMER_SECRET || "";
const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders?consumer_key=${wcKey}&consumer_secret=${wcSecret}&per_page=1`;

fetch(url)
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data).substring(0, 500)))
  .catch(err => console.error(err));
