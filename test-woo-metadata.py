import os
from dotenv import load_dotenv
import requests
import json

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

res = requests.get(f"{url}/wp-json/wc/v3/products?per_page=1", auth=(key, secret))
p = res.json()[0]
print(f"Product: {p['name']}")
print("Meta data:")
for m in p.get('meta_data', []):
    print(f"  {m['key']}: {m['value']}")
print("\nTags:")
for t in p.get('tags', []):
    print(f"  {t['name']} ({t['slug']})")
