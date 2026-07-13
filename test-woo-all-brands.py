import os
from dotenv import load_dotenv
import requests
import json

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

res = requests.get(f"{url}/wp-json/wc/v3/products?per_page=100", auth=(key, secret))
products = res.json()
count = 0
for p in products:
    brand_attr = next((a for a in p['attributes'] if a['slug'] == 'pa_brand'), None)
    if brand_attr:
        count += 1

print(f"Found {count} products with pa_brand attribute out of {len(products)}")
