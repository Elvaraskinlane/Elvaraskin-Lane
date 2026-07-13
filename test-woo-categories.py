import os
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

# Let's verify we can fetch all categories and filter by slug client-side
res = requests.get(f"{url}/wp-json/wc/v3/products/categories?per_page=100", auth=(key, secret))
categories = res.json()
print("Total Categories:", len(categories))
for c in categories[:5]:
    print(c['slug'], c['id'])
