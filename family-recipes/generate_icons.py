import json
import os
from PIL import Image

src_img = "/Users/boskombp16/.cursor/projects/Users-boskombp16-GitHub-family-recipes/assets/icon-option-2.png"
appicon_dir = "/Users/boskombp16/GitHub/family-recipes/family-recipes/family-recipes/Assets.xcassets/AppIcon.appiconset"

# Ensure directory exists
os.makedirs(appicon_dir, exist_ok=True)

img = Image.open(src_img)

sizes = [
    (20, 2), (20, 3),
    (29, 2), (29, 3),
    (40, 2), (40, 3),
    (60, 2), (60, 3),
    (76, 2), (83.5, 2),
    (1024, 1)
]

images_json = []

for size, scale in sizes:
    pixel_size = int(size * scale)
    filename = f"icon-{size}x{size}@{scale}x.png"
    if size == 1024:
        filename = "icon-1024.png"
        
    out_path = os.path.join(appicon_dir, filename)
    resized = img.resize((pixel_size, pixel_size), Image.Resampling.LANCZOS)
    resized.save(out_path)
    
    # Remove decimal for json string if it's .0
    size_str = f"{size}x{size}" if size.is_integer() else f"{size}x{size}"
    
    images_json.append({
        "size": size_str,
        "idiom": "ios-marketing" if size == 1024 else ("ipad" if size in [76, 83.5] else "iphone"),
        "filename": filename,
        "scale": f"{scale}x"
    })

# Add missing standard iPad sizes just in case
extra_sizes = [
    (20, 1, "ipad"), (29, 1, "ipad"), (40, 1, "ipad"), (76, 1, "ipad")
]

for size, scale, idiom in extra_sizes:
    pixel_size = int(size * scale)
    filename = f"icon-{size}x{size}@{scale}x-{idiom}.png"
    out_path = os.path.join(appicon_dir, filename)
    resized = img.resize((pixel_size, pixel_size), Image.Resampling.LANCZOS)
    resized.save(out_path)
    
    images_json.append({
        "size": f"{size}x{size}",
        "idiom": idiom,
        "filename": filename,
        "scale": f"{scale}x"
    })

contents = {
    "images": images_json,
    "info": {
        "author": "xcode",
        "version": 1
    }
}

with open(os.path.join(appicon_dir, "Contents.json"), "w") as f:
    json.dump(contents, f, indent=2)

print("App icons generated successfully.")
