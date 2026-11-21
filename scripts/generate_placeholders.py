import os
import json
from PIL import Image, ImageDraw, ImageFont

os.makedirs('public/images/products', exist_ok=True)

# Generate a clean luxury placeholder for each of the 600 files
with open('products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Category styling colors
BG_COLOR = (248, 245, 239) # Warm Ivory #F8F5EF
BORDER_COLOR = (228, 217, 203) # Hairline #E4D9CB
GOLD_COLOR = (184, 146, 74) # Gold #B8924A
INK_COLOR = (43, 37, 34) # Ink #2B2522
MUTED_COLOR = (110, 98, 90) # Taupe #6E625A

# Create a base template image for each category (600x750, 4:5 ratio)
W, H = 600, 750

category_templates = {}
categories = set(p['category'] for p in data['products'])

for cat in categories:
    img = Image.new('RGB', (W, H), color=BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Outer luxury border
    draw.rectangle([20, 20, W - 21, H - 21], outline=BORDER_COLOR, width=1)
    draw.rectangle([26, 26, W - 27, H - 27], outline=BORDER_COLOR, width=1)

    # Decorative gold corner accents
    for x, y in [(35, 35), (W - 35, 35), (35, H - 35), (W - 35, H - 35)]:
        draw.rectangle([x - 4, y - 4, x + 4, y + 4], fill=GOLD_COLOR)

    # Crown motif / jewelry diamond motif in center
    cx, cy = W // 2, H // 2 - 40
    # Diamond shape
    diamond = [(cx, cy - 50), (cx + 45, cy), (cx, cy + 50), (cx - 45, cy)]
    draw.polygon(diamond, outline=GOLD_COLOR, width=2)
    # Inner diamond
    inner_diamond = [(cx, cy - 30), (cx + 25, cy), (cx, cy + 30), (cx - 25, cy)]
    draw.polygon(inner_diamond, outline=BORDER_COLOR, width=1)
    
    # Connecting star rays
    draw.line([(cx, cy - 70), (cx, cy + 70)], fill=BORDER_COLOR, width=1)
    draw.line([(cx - 70, cy), (cx + 70, cy)], fill=BORDER_COLOR, width=1)

    # Center jewel dot
    draw.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=GOLD_COLOR)

    # Text rendering (using default font with centered positions)
    # Brand title
    brand_text = "M I N H A   J E W E L L E R S"
    draw.text((cx, cy + 100), brand_text, fill=INK_COLOR, anchor="mm")

    # Category name
    cat_text = cat.upper()
    draw.text((cx, cy + 130), cat_text, fill=GOLD_COLOR, anchor="mm")

    # Subtitle
    sub_text = "Handcrafted Demi-Fine • Spring 2026"
    draw.text((cx, cy + 160), sub_text, fill=MUTED_COLOR, anchor="mm")

    category_templates[cat] = img

# Now write each image in products.json
written = 0
for p in data['products']:
    cat = p.get('category', 'Jewelry')
    template = category_templates.get(cat, category_templates[list(categories)[0]])
    for img_path in p.get('images', []):
        filename = os.path.basename(img_path)
        dest_path = os.path.join('public/images/products', filename)
        if not os.path.exists(dest_path):
            template.save(dest_path, 'JPEG', quality=85)
            written += 1

print(f"Generated {written} clean category placeholder image files in public/images/products/")
