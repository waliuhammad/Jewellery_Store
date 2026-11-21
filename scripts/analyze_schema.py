import json
from collections import Counter

data = json.load(open('products.json', encoding='utf-8'))
products = data['products']

keys = set()
for p in products:
    keys.update(p.keys())

print("All keys across products.json:", sorted(list(keys)))

print("\nOccasions counter:")
occasions = []
for p in products:
    occ = p.get('occasion', [])
    if isinstance(occ, list):
        occasions.extend(occ)
    elif occ:
        occasions.append(occ)
print(Counter(occasions))

print("\nMaterials counter:")
print(Counter(p.get('material') for p in products))

print("\nColors counter:")
print(Counter(p.get('color') for p in products))

print("\nGemstones counter:")
print(Counter(p.get('gemstone') for p in products).most_common(10))

print("\nStock values:")
stocks = [p.get('stock') for p in products]
print(f"Min stock: {min(stocks)}, Max stock: {max(stocks)}, Zero stock count: {stocks.count(0)}")

print("\nFeatured count:", sum(1 for p in products if p.get('featured')))
print("New arrival count:", sum(1 for p in products if p.get('new_arrival')))

print("\nSample product 0:")
print(json.dumps(products[0], indent=2))
