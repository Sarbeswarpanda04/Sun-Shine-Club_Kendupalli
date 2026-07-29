import os
from PIL import Image, ImageOps

# ===========================
# CONFIGURATION
# ===========================

INPUT_FOLDER = "assets/members"
OUTPUT_FOLDER = "assets/images/optimized_members"

SIZE = (200, 200)
QUALITY = 85

SUPPORTED = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")

# ===========================
# CREATE OUTPUT FOLDER
# ===========================

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ===========================
# PROCESS IMAGES
# ===========================

processed = 0
original_total = 0
optimized_total = 0

for filename in os.listdir(INPUT_FOLDER):

    if not filename.lower().endswith(SUPPORTED):
        continue

    input_path = os.path.join(INPUT_FOLDER, filename)

    try:

        original_total += os.path.getsize(input_path)

        img = Image.open(input_path)

        # Fix orientation from phone cameras
        img = ImageOps.exif_transpose(img)

        # Convert to RGB
        img = img.convert("RGB")

        # Resize and center crop
        img = ImageOps.fit(
            img,
            SIZE,
            Image.Resampling.LANCZOS,
            centering=(0.5, 0.5)
        )

        output_name = os.path.splitext(filename)[0] + ".webp"

        output_path = os.path.join(
            OUTPUT_FOLDER,
            output_name
        )

        img.save(
            output_path,
            "WEBP",
            quality=QUALITY,
            method=6
        )

        optimized_total += os.path.getsize(output_path)

        processed += 1

        print(f"✓ {filename} -> {output_name}")

    except Exception as e:

        print(f"✗ Error processing {filename}")
        print(e)

print("\n==============================")
print("Optimization Complete")
print("==============================")
print(f"Images Processed : {processed}")

print(
    f"Original Size : {original_total/1024/1024:.2f} MB"
)

print(
    f"Optimized Size: {optimized_total/1024/1024:.2f} MB"
)

if original_total > 0:

    reduction = (
        (original_total-optimized_total)
        / original_total
    )*100

    print(f"Reduced by : {reduction:.1f}%")