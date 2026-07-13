import os
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

res = requests.get(f"{url}/wp-json/wc/v3/products/attributes", auth=(key, secret))
attrs = res.json()
print("Attributes:")
for a in attrs:
    print(f"{a['id']} - {a['name']} ({a['slug']})")

brand_attr = next((a for a in attrs if a['slug'] == 'pa_brand'), None)
if brand_attr:
    res = requests.get(f"{url}/wp-json/wc/v3/products/attributes/{brand_attr['id']}/terms", auth=(key, secret))
    terms = res.json()
    print("\nTerms:")
    for t in terms:
        print(f"{t['id']} - {t['name']} ({t['slug']})")
