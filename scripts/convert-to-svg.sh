#!/bin/bash

DIR="${1:-.}"

find "$DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.avif" \) | while read -r f; do
  base="${f%.*}"
  echo "Converting: $f"
  tmp="${base}_tmp.png"
  magick "$f" -fuzz 20% -transparent black -fuzz 20% -transparent white "$tmp"
  vtracer --colormode bw --input "$tmp" --output "${base}.svg"
  rm "$tmp"
done

echo "Done."
