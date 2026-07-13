import os
from dotenv import load_dotenv
import requests
import json

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

res = requests.get(f"{url}/wp-json/wc/v3/products?per_page=5", auth=(key, secret))
products = res.json()
for p in products:
    print(f"Product: {p['name']}")
    print("Attributes:", json.dumps(p['attributes'], indent=2))
