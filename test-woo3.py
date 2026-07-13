import os
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

# Fetch using slug
res = requests.get(f"{url}/wp-json/wc/v3/products/attributes/1/terms?slug=advanced-korean-products", auth=(key, secret))
terms = res.json()
print("Terms from slug:")
print(terms)
