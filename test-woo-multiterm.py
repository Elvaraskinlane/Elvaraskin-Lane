import os
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

# Fetch products with two attribute terms
res = requests.get(f"{url}/wp-json/wc/v3/products?attribute=pa_length&attribute_term=25,26", auth=(key, secret))
print("Products returned for multiple attribute terms:", len(res.json()))
