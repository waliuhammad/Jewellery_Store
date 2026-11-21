import json
import re

# Read src/data/products.js
with open('src/data/products.js', 'r', encoding='utf-8') as f:
    src_content = f.read()

# Read products.json
with open('products.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

print(f"Products in products.json: {len(json_data['products'])}")
print(f"Categories in products.json: {json_data.get('categories')}")

# Extract existing slugs and ids from src/data/products.js
id_matches = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", src_content)
slug_matches = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", src_content)

print(f"Total IDs in src/data/products.js: {len(id_matches)}")
print(f"IDs: {id_matches}")
print(f"Total Slugs in src/data/products.js: {len(slug_matches)}")
print(f"Slugs: {slug_matches}")

# Check overlap with products.json
json_skus = set(p.get('sku') for p in json_data['products'] if p.get('sku'))
json_slugs = set(p.get('slug') for p in json_data['products'] if p.get('slug'))
json_ids = set(str(p.get('id')) for p in json_data['products'] if p.get('id'))

print(f"Overlap between existing slugs and json slugs: {set(slug_matches).intersection(json_slugs)}")
print(f"Overlap between existing IDs and json IDs: {set(id_matches).intersection(json_ids)}")
