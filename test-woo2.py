import os
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

res = requests.get(f"{url}/wp-json/wc/v3/products/attributes/1/terms?per_page=100", auth=(key, secret))
terms = res.json()
print("All Terms:")
for t in terms:
    print(f"{t['name']} -> {t['slug']}")
