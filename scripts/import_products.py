import json
import re

# 1. Load products.json
with open('products.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

raw_products = json_data['products']

# 2. Category mapping
CAT_MAP = {
    'Necklaces': 'necklaces',
    'Earrings': 'earrings',
    'Rings': 'rings',
    'Bracelets': 'bracelets',
    'Bangles': 'bangles',
    'Anklets': 'anklets',
    'Pendants': 'pendants',
    'Bridal Sets': 'bridal-sets',
    'Maang Tikka': 'maang-tikka',
    'Chains': 'chains'
}

# 3. Read existing src/data/products.js
with open('src/data/products.js', 'r', encoding='utf-8') as f:
    existing_content = f.read()

# Extract existing product objects by parsing JS AST or evaluating
# Since products.js is JS, let's extract the PRODUCTS array safely
products_match = re.search(r'export const PRODUCTS = \[(.*?)\];\s*$', existing_content, re.DOTALL)
if not products_match:
    raise ValueError("Could not find export const PRODUCTS in src/data/products.js")

existing_products_code = products_match.group(1).strip()

# Collect existing slugs and skus
existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", existing_products_code))
existing_ids = set(re.findall(r"id:\s*['\"]([^'\"]+)['\"]", existing_products_code))
existing_skus = set(re.findall(r"sku:\s*['\"]([^'\"]+)['\"]", existing_products_code))

print(f"Existing products count: {len(existing_slugs)}")
print(f"Existing slugs: {existing_slugs}")

# 4. Map and filter new products
added_products = []
skipped_products = []

for p in raw_products:
    sku = p.get('sku', '')
    slug = p.get('slug', '')
    p_id = sku.lower() if sku else f"prod-{p.get('id')}"

    # Check for duplicates
    if (sku and sku in existing_skus) or (slug and slug in existing_slugs) or (p_id in existing_ids):
        skipped_products.append(p)
        continue

    # Categories
    raw_cat = p.get('category', 'Necklaces')
    cat_slug = CAT_MAP.get(raw_cat, raw_cat.lower().replace(' ', '-'))

    # Pricing
    price = p.get('price', 0)
    sale_price = p.get('sale_price')
    if sale_price is not None and sale_price < price:
        selling_price = sale_price
        compare_at_price = price
        is_sale = True
    else:
        selling_price = price
        compare_at_price = None
        is_sale = False

    # Stock
    stock = int(p.get('stock', 0))

    # Badge
    if is_sale:
        badge = 'SALE'
    elif p.get('new_arrival'):
        badge = 'NEW'
    elif 0 < stock <= 5:
        badge = 'LOW STOCK'
    elif p.get('featured'):
        badge = 'BESTSELLER'
    else:
        badge = None

    # Occasions
    raw_occs = [str(o).lower() for o in p.get('occasion', [])]
    mapped_occs = []
    if any(o in raw_occs for o in ['daily wear', 'office']):
        mapped_occs.append('everyday')
    if any(o in raw_occs for o in ['gift']):
        mapped_occs.append('gifting')
    if any(o in raw_occs for o in ['festive', 'wedding', 'eid', 'mehndi', 'party']):
        mapped_occs.append('festive')
    for o in raw_occs:
        mapped_occs.append(o.replace(' ', '-'))
    if not mapped_occs:
        mapped_occs.append('everyday')
    mapped_occs = list(dict.fromkeys(mapped_occs)) # unique preserving order

    # Sizes
    if cat_slug == 'rings':
        sizes = ['Size 6', 'Size 7', 'Size 8', 'Size 9']
    elif cat_slug in ['bangles', 'bracelets']:
        sizes = ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)']
    else:
        sizes = ['Standard']

    # Tagline
    subcat = p.get('subcategory', '')
    mat = p.get('material', '')
    gem = p.get('gemstone', '')
    tagline_parts = [subcat]
    if mat:
        tagline_parts.append(f"in {mat}")
    if gem and gem != 'None':
        tagline_parts.append(f"with {gem}")
    tagline = ' '.join(tagline_parts) or p.get('name')

    # Details
    details = [
        f"Material Core: {mat}",
        f"Color & Tone: {p.get('color', 'Gold')}",
    ]
    if gem and gem != 'None':
        details.append(f"Gemstone Detailing: {gem}")
    if p.get('occasion'):
        details.append(f"Ideal Occasion: {', '.join(p.get('occasion'))}")
    details.append("Anti-tarnish protective coating & hypoallergenic finish")
    details.append("Includes complimentary Minha signature suede storage pouch")

    # Images: ensure valid strings
    images = p.get('images', [])

    mapped_prod = {
        'id': p_id,
        'sku': sku,
        'slug': slug,
        'name': p.get('name'),
        'tagline': tagline,
        'category': cat_slug,
        'categoryName': raw_cat,
        'subcategory': subcat,
        'price': selling_price,
        'compareAtPrice': compare_at_price,
        'sale_price': sale_price,
        'badge': badge,
        'rating': float(p.get('rating', 4.8)),
        'reviewCount': int(p.get('reviews_count', 0)),
        'reviews_count': int(p.get('reviews_count', 0)),
        'isNew': bool(p.get('new_arrival', False)),
        'new_arrival': bool(p.get('new_arrival', False)),
        'isBestseller': bool(p.get('featured', False)),
        'isFeatured': bool(p.get('featured', False)),
        'featured': bool(p.get('featured', False)),
        'occasions': mapped_occs,
        'occasion': p.get('occasion', []),
        'material': mat,
        'color': p.get('color', ''),
        'gemstone': gem,
        'finish': p.get('color') or mat,
        'finishes': [p.get('color') or mat],
        'sizes': sizes,
        'stock': stock,
        'description': p.get('description', ''),
        'details': details,
        'care': 'Store in your Minha suede pouch. Wipe gently with a dry microfiber cloth after wearing. Keep away from direct perfumes, sanitizers, and water.',
        'images': images,
        'gender': p.get('gender', 'Women'),
        'tags': p.get('tags', []),
        'created_at': p.get('created_at', ''),
    }

    added_products.append(mapped_prod)

print(f"Added products: {len(added_products)}")
print(f"Skipped products: {len(skipped_products)}")
