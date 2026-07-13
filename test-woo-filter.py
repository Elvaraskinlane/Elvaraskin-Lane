import os
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

# Test fetching products for advanced-korean-products (term id 69)
res = requests.get(f"{url}/wp-json/wc/v3/products?attribute=pa_brand&attribute_term=69", auth=(key, secret))
products = res.json()
print(f"Products with attribute pa_brand=69: {len(products)}")

res2 = requests.get(f"{url}/wp-json/wc/v3/products?category=117&attribute=pa_brand&attribute_term=82", auth=(key, secret))
products2 = res2.json()
print(f"Products with category=117 & pa_brand=82 (COSRX): {len(products2)}")

