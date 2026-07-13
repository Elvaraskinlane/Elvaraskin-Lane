import os
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_WORDPRESS_URL')
key = os.environ.get('WC_CONSUMER_KEY')
secret = os.environ.get('WC_CONSUMER_SECRET')

# Let's see what lengths exist
res = requests.get(f"{url}/wp-json/wc/v3/products/attributes/3/terms", auth=(key, secret))
terms = res.json()
print("Length terms:")
for t in terms:
    print(t['id'], t['name'])

if len(terms) >= 2:
    ids = f"{terms[0]['id']},{terms[1]['id']}"
    res2 = requests.get(f"{url}/wp-json/wc/v3/products?attribute=pa_length&attribute_term={ids}", auth=(key, secret))
    print(f"\nProducts for terms {ids}:", len(res2.json()))
