#!/bin/bash
# upload.sh

UPLOAD_URL=$(curl -s -X POST https://api.mux.com/video/v1/uploads \
  -u ${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET} \
  -H "Content-Type: application/json" \
  -d '{
    "new_asset_settings": {
      "playback_policy": ["public"],
      "video_quality": "plus",
      "max_resolution_tier": "2160p"
    }
  }' \
  | jq -r '.data.url')

echo "Uploading to Mux..."
pv "$1" | curl -X PUT "$UPLOAD_URL" \
  --upload-file - \
  -H "Content-Type: application/octet-stream"

echo "Done! Check Mux dashboard for processing status."
