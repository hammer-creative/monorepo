#!/usr/bin/env bash

OUTPUT_FILE="case-study-teaser-placeholder.jpg"
WIDTH=1380
HEIGHT=800
BG_COLOR="#141515"
TEXT_COLOR="#C7D3D3"

magick -size 1380x800 canvas:"#141515" \
  -depth 8 \
  -type TrueColor \
  -colorspace sRGB \
  -fill "#C7D3D3" \
  -gravity NorthWest \
  -pointsize 28 \
  -annotate +60+60 "Case Study Teaser Image\nMinimum dimensions: 1380 px × 800 px\nAspect ratio: 17:10 Landscape\nMaximum file size: 2 MB" \
  -strip \
  -sampling-factor 4:2:0 \
  -quality 85 \
  case-study-teaser-placeholder.jpg
