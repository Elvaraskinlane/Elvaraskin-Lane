import os
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

res = requests.get(f"{url}/wp-json/wc/v3/products/categories?slug=face,oral-care", auth=(key, secret))
print("Categories:", len(res.json()))
for c in res.json():
    print(c['slug'], c['id'])
