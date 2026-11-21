import json
import re

# 1. Load products.json
with open('products.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

raw_products = json_data['products']

# 2. Read existing src/data/products.js
with open('src/data/products.js', 'r', encoding='utf-8') as f:
    existing_content = f.read()

# Category mapping
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

# Extract the existing 12 products code chunk
# We can find where PRODUCTS array starts and ends
prod_start_idx = existing_content.find('export const PRODUCTS = [')
if prod_start_idx == -1:
    raise ValueError("Could not find export const PRODUCTS")

# The existing 12 products are between 'export const PRODUCTS = [' and the end of array
# Let's read the existing 12 product items as raw JS
array_content = existing_content[prod_start_idx + len('export const PRODUCTS = ['):].strip()
if array_content.endswith('];'):
    array_content = array_content[:-2].strip()

# Existing slugs
existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", array_content))
existing_skus = set(re.findall(r"sku:\s*['\"]([^'\"]+)['\"]", array_content))

# Map new products
added_products = []
skipped_products = []

for p in raw_products:
    sku = p.get('sku', '')
    slug = p.get('slug', '')
    p_id = sku.lower() if sku else f"prod-{p.get('id')}"

    if (sku and sku in existing_skus) or (slug and slug in existing_slugs):
        skipped_products.append(slug)
        continue

    raw_cat = p.get('category', 'Necklaces')
    cat_slug = CAT_MAP.get(raw_cat, raw_cat.lower().replace(' ', '-'))

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

    stock = int(p.get('stock', 0))

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
    mapped_occs = list(dict.fromkeys(mapped_occs))

    if cat_slug == 'rings':
        sizes = ['Size 6', 'Size 7', 'Size 8', 'Size 9']
    elif cat_slug in ['bangles', 'bracelets']:
        sizes = ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)']
    else:
        sizes = ['Standard']

    subcat = p.get('subcategory', '')
    mat = p.get('material', '')
    gem = p.get('gemstone', '')
    tagline_parts = [subcat]
    if mat:
        tagline_parts.append(f"in {mat}")
    if gem and gem != 'None':
        tagline_parts.append(f"with {gem}")
    tagline = ' '.join(tagline_parts) or p.get('name')

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

print(f"Adding {len(added_products)} products, skipping {len(skipped_products)}")

# Form the new CATEGORIES array
new_categories_code = """export const CATEGORIES = [
  { id: 'rings', name: 'Rings', slug: 'rings', count: 34, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop' },
  { id: 'necklaces', name: 'Necklaces', slug: 'necklaces', count: 33, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop' },
  { id: 'earrings', name: 'Earrings', slug: 'earrings', count: 32, image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=900&auto=format&fit=crop' },
  { id: 'bracelets', name: 'Bracelets & Bangles', slug: 'bracelets', count: 32, image: 'https://images.unsplash.com/photo-1611591475824-340801a23864?q=80&w=900&auto=format&fit=crop' },
  { id: 'sets', name: 'Bridal & Gift Sets', slug: 'sets', count: 32, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=900&auto=format&fit=crop' },
  { id: 'bangles', name: 'Bangles', slug: 'bangles', count: 30, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=900&auto=format&fit=crop' },
  { id: 'anklets', name: 'Anklets', slug: 'anklets', count: 30, image: 'https://images.unsplash.com/photo-1611591475824-340801a23864?q=80&w=900&auto=format&fit=crop' },
  { id: 'pendants', name: 'Pendants', slug: 'pendants', count: 30, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop' },
  { id: 'bridal-sets', name: 'Bridal Sets', slug: 'bridal-sets', count: 30, image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=900&auto=format&fit=crop' },
  { id: 'maang-tikka', name: 'Maang Tikka', slug: 'maang-tikka', count: 30, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=900&auto=format&fit=crop' },
  { id: 'chains', name: 'Chains', slug: 'chains', count: 30, image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=900&auto=format&fit=crop' },
];

export const OCCASIONS = [
  { id: 'everyday', name: 'Everyday Radiance' },
  { id: 'gifting', name: 'Thoughtful Gifting' },
  { id: 'festive', name: 'Festive & Bridal' },
];
"""

# Format new products into JS code
def to_js_val(v):
    if v is None:
        return 'null'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, list):
        return '[' + ', '.join(to_js_val(x) for x in v) + ']'
    if isinstance(v, dict):
        entries = [f"      {k}: {to_js_val(val)}" for k, val in v.items()]
        return '{\n' + ',\n'.join(entries) + '\n    }'
    return json.dumps(v)

formatted_new_products = []
for p in added_products:
    lines = ['  {']
    for k, v in p.items():
        lines.append(f"    {k}: {to_js_val(v)},")
    lines.append('  }')
    formatted_new_products.append('\n'.join(lines))

new_products_block = ',\n'.join(formatted_new_products)

# Combine existing products with new products
array_content_clean = array_content.rstrip().rstrip(',')
full_products_file = f"""/**
 * Minha Jewellers - Product Catalog
 * Curated fine & fashion jewelry with warm editorial photography, specifications, and variants.
 */

{new_categories_code}
export const PRODUCTS = [
{array_content_clean},
{new_products_block}
];
"""

with open('src/data/products.js', 'w', encoding='utf-8') as f:
    f.write(full_products_file)

print("Successfully updated src/data/products.js with all 312 products!")
