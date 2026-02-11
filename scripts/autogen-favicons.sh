#!/bin/bash

# Generate all favicon sizes from four sources
# Small sizes (16-48px) from favicon-source-small.png
# Large sizes (144px+) from favicon-source-large.png
# Startup images from favicon-source-startup.png (designed at 1125x2436)
# Safari pinned tab from favicon-source-monochrome.svg
# Requires: ImageMagick (brew install imagemagick)
# Requires: png2ico (npm install -g png2ico)

SOURCE_SMALL="favicon-source-small.png"
SOURCE_LARGE="favicon-source-large.png"
SOURCE_STARTUP="favicon-source-startup.png"
SOURCE_MONOCHROME="favicon-source-monochrome.svg"
OUTPUT_DIR="../apps/web/public/favicons"

echo "🧹 Cleaning output directory..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "📦 Generating small PNGs from $SOURCE_SMALL..."
magick convert "$SOURCE_SMALL" -resize 16x16 -strip "$OUTPUT_DIR/favicon-16x16.png"
echo "  ✓ Created favicon-16x16.png"
magick convert "$SOURCE_SMALL" -resize 32x32 -strip "$OUTPUT_DIR/favicon-32x32.png"
echo "  ✓ Created favicon-32x32.png"
magick convert "$SOURCE_SMALL" -resize 48x48 -strip "$OUTPUT_DIR/favicon-48x48.png"
echo "  ✓ Created favicon-48x48.png"

echo "📦 Generating large PNGs from $SOURCE_LARGE..."
magick convert "$SOURCE_LARGE" -resize 180x180 -strip "$OUTPUT_DIR/apple-touch-icon.png"
echo "  ✓ Created apple-touch-icon.png"
magick convert "$SOURCE_LARGE" -resize 180x180 -strip "$OUTPUT_DIR/apple-touch-icon-precomposed.png"
echo "  ✓ Created apple-touch-icon-precomposed.png"
magick convert "$SOURCE_LARGE" -resize 192x192 -strip "$OUTPUT_DIR/icon-192.png"
echo "  ✓ Created icon-192.png"
magick convert "$SOURCE_LARGE" -resize 192x192 -strip "$OUTPUT_DIR/android-chrome-192x192.png"
echo "  ✓ Created android-chrome-192x192.png"
magick convert "$SOURCE_LARGE" -resize 512x512 -strip "$OUTPUT_DIR/icon-512.png"
echo "  ✓ Created icon-512.png"
magick convert "$SOURCE_LARGE" -resize 512x512 -strip "$OUTPUT_DIR/android-chrome-512x512.png"
echo "  ✓ Created android-chrome-512x512.png"
magick convert "$SOURCE_LARGE" -resize 144x144 -strip "$OUTPUT_DIR/mstile-144x144.png"
echo "  ✓ Created mstile-144x144.png"
magick convert "$SOURCE_LARGE" -resize 150x150 -strip "$OUTPUT_DIR/mstile-150x150.png"
echo "  ✓ Created mstile-150x150.png"

echo "📦 Generating Apple startup images from $SOURCE_STARTUP..."
magick convert "$SOURCE_STARTUP" -resize 1125x2436 -strip "$OUTPUT_DIR/apple-touch-startup-image-1125x2436.png"
echo "  ✓ Created apple-touch-startup-image-1125x2436.png"
magick convert "$SOURCE_STARTUP" -resize x1334 -gravity center -extent 750x1334 -strip "$OUTPUT_DIR/apple-touch-startup-image-750x1334.png"
echo "  ✓ Created apple-touch-startup-image-750x1334.png"
magick convert "$SOURCE_STARTUP" -resize x2208 -gravity center -extent 1242x2208 -strip "$OUTPUT_DIR/apple-touch-startup-image-1242x2208.png"
echo "  ✓ Created apple-touch-startup-image-1242x2208.png"

echo "📦 Copying Safari pinned tab from $SOURCE_MONOCHROME..."
cp "$SOURCE_MONOCHROME" "$OUTPUT_DIR/safari-pinned-tab.svg"
echo "  ✓ Created safari-pinned-tab.svg"

echo "📦 Generating favicon.ico..."
png2ico "$OUTPUT_DIR/favicon.ico" "$OUTPUT_DIR/favicon-16x16.png" "$OUTPUT_DIR/favicon-32x32.png" "$OUTPUT_DIR/favicon-48x48.png"
if [ -f "$OUTPUT_DIR/favicon.ico" ]; then
  echo "  ✓ Created favicon.ico"
else
  echo "  ✗ Failed to create favicon.ico"
  exit 1
fi

echo "📦 Creating site.webmanifest..."
cat > "$OUTPUT_DIR/site.webmanifest" << 'EOF'
{
  "name": "Hammer Creative",
  "short_name": "Hammer",
  "description": "The Gaming Agency",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#2d89ef",
  "lang": "en-US",
  "dir": "ltr",
  "categories": ["business", "entertainment"],
  "icons": [
    {
      "src": "/favicons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
EOF
echo "  ✓ Created site.webmanifest"

echo "📦 Creating browserconfig.xml..."
cat > "$OUTPUT_DIR/browserconfig.xml" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/favicons/mstile-150x150.png"/>
      <square144x144logo src="/favicons/mstile-144x144.png"/>
      <TileColor>#2d89ef</TileColor>
    </tile>
  </msapplication>
</browserconfig>
EOF
echo "  ✓ Created browserconfig.xml"

echo ""
echo "✅ All favicon files generated successfully in $OUTPUT_DIR"
echo "  Small sizes from: $SOURCE_SMALL"
echo "  Large sizes from: $SOURCE_LARGE"
echo "  Startup images from: $SOURCE_STARTUP"
echo "  Safari pinned tab from: $SOURCE_MONOCHROME"
