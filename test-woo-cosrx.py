import os
from dotenv import load_dotenv
import requests
import json

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

res = requests.get(f"{url}/wp-json/wc/v3/products?search=cosrx", auth=(key, secret))
products = res.json()
print(f"Found {len(products)} COSRX products")
if products:
    print(f"Product: {products[0]['name']}")
    print("Attributes:", json.dumps(products[0]['attributes'], indent=2))
