import json
import re

with open('products.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

raw_products = json_data['products']

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

with open('server/src/data/initialProducts.js', 'r', encoding='utf-8') as f:
    existing_content = f.read()

prod_start_idx = existing_content.find('export const INITIAL_PRODUCTS = [')
array_content = existing_content[prod_start_idx + len('export const INITIAL_PRODUCTS = ['):].strip()
if array_content.endswith('];'):
    array_content = array_content[:-2].strip()

array_content_clean = array_content.rstrip().rstrip(',')
existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", array_content_clean))
existing_skus = set(re.findall(r"sku:\s*['\"]([^'\"]+)['\"]", array_content_clean))

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

added_products = []
for p in raw_products:
    sku = p.get('sku', '')
    slug = p.get('slug', '')
    p_id = sku.lower() if sku else f"prod-{p.get('id')}"

    if (sku and sku in existing_skus) or (slug and slug in existing_slugs):
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

    mat = p.get('material', '')
    gem = p.get('gemstone', '')
    subcat = p.get('subcategory', '')
    tagline_parts = [subcat]
    if mat:
        tagline_parts.append(f"in {mat}")
    if gem and gem != 'None':
        tagline_parts.append(f"with {gem}")
    tagline = ' '.join(tagline_parts) or p.get('name')

    images = [{'url': img, 'alt': f"{p.get('name')} view {i+1}", 'order': i+1} for i, img in enumerate(p.get('images', []))]

    keywords = list(set(f"{p.get('name')} {raw_cat} {cat_slug} {mat} {gem} {subcat} {' '.join(p.get('tags', []))}".lower().split()))

    prod_obj = {
        'id': p_id,
        'name': p.get('name'),
        'slug': slug,
        'sku': sku,
        'shortDescription': tagline,
        'description': p.get('description', ''),
        'categoryId': cat_slug,
        'category': cat_slug,
        'price': selling_price,
        'compareAtPrice': compare_at_price,
        'currency': 'PKR',
        'material': mat,
        'finish': p.get('color') or mat,
        'gemstone': gem,
        'tags': p.get('tags', []),
        'occasions': mapped_occs,
        'isActive': True,
        'isFeatured': bool(p.get('featured', False)),
        'isNew': bool(p.get('new_arrival', False)),
        'isBestseller': bool(p.get('featured', False)),
        'ratingAverage': float(p.get('rating', 4.8)),
        'ratingCount': int(p.get('reviews_count', 0)),
        'stock': stock,
        'images': images,
        'keywords': keywords,
    }
    added_products.append(prod_obj)

formatted_new = []
for p in added_products:
    lines = ['  {']
    for k, v in p.items():
        lines.append(f"    {k}: {to_js_val(v)},")
    lines.append('  }')
    formatted_new.append('\n'.join(lines))

header = existing_content[:prod_start_idx].strip()
joined_formatted = ',\n'.join(formatted_new)
full_server_products = f"""{header}

export const INITIAL_PRODUCTS = [
{array_content_clean},
{joined_formatted}
];
"""

with open('server/src/data/initialProducts.js', 'w', encoding='utf-8') as f:
    f.write(full_server_products)

print(f"Updated server/src/data/initialProducts.js with {len(added_products)} added products!")
