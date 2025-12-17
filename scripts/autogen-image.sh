#!/usr/bin/env bash

OUT_DIR="./placeholders"
BG="#141515"
FG="#C7D3D3"
FONT_SIZE=36

mkdir -p "$OUT_DIR"

generate() {
  local FILE=$1
  local W=$2
  local H=$3
  local LABEL=$4
  local RATIO=$5

  magick -size ${W}x${H} canvas:"$BG" \
    -fill "$FG" \
    -gravity Center \
    -pointsize $FONT_SIZE \
    -annotate 0 "$LABEL\n${W} × ${H}\nAspect ratio: ${RATIO}" \
    -strip \
    "${OUT_DIR}/${FILE}"
}

# ─────────────────────────
# Case Studies
# ─────────────────────────

generate "case-study-hero.png" 3840 2160 "Case Study Hero Image" "16:9"
generate "text-image-module.png" 1960 1400 "Text + Image Module" "7:5"
generate "inline-video-poster.png" 3840 2160 "Inline Video Poster Image" "16:9"
generate "vertical-video-poster.png" 1200 2000 "Vertical Video Poster Image" "3:5"
generate "carousel-image.png" 1360 1360 "Carousel Image" "1:1"

# ─────────────────────────
# Homepage
# ─────────────────────────

generate "homepage-hero.png" 3840 2160 "Homepage Hero Image" "16:9"
generate "homepage-teaser.png" 1890 1130 "Homepage Teaser Image" "5:3"

# ─────────────────────────
# Services Page
# ─────────────────────────

generate "services-hero.png" 3840 2160 "Services Page Hero Image" "16:9"
generate "services-summary.png" 3760 1080 "Services Summary Image" "32:9"
