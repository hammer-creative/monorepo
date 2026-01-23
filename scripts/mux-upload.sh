#!/bin/bash
set -euo pipefail

# usage:
# ./mux-upload.sh s3://bucket/prefix [profile] [--dry-run]

ROOT="${1:?Usage: $0 s3://bucket/prefix [profile] [--dry-run]}"
PROFILE="${2:-hammer}"
DRY_RUN=false
[[ "${3:-}" == "--dry-run" ]] && DRY_RUN=true

: "${MUX_TOKEN_ID:?Missing MUX_TOKEN_ID}"
: "${MUX_TOKEN_SECRET:?Missing MUX_TOKEN_SECRET}"

STATE_FILE="./uploaded.txt"
touch "$STATE_FILE"

BUCKET="$(echo "$ROOT" | sed -E 's#s3://([^/]+)/.*#\1#')"

aws s3 ls "$ROOT" --recursive --profile "$PROFILE" \
| awk '{print $4}' \
| grep -E '\.mp4$' \
| while read -r key; do

  S3_PATH="s3://$BUCKET/$key"
  RAW_FILENAME="$(basename "$key")"

  # title: strip .mp4, convert underscores to spaces (nothing else)
  TITLE="$(basename "$RAW_FILENAME" | sed -E 's/\.mp4$//; s/_+/ /g')"

  # dedupe key
  KEY_HASH="$(printf "%s" "$key" | shasum -a 256 | cut -c1-32)"

  # rsync-style skip
  if grep -Fxq "$KEY_HASH" "$STATE_FILE"; then
    echo "↺ SKIP: $S3_PATH"
    continue
  fi

  if $DRY_RUN; then
    echo "[DRY RUN] $S3_PATH"
    echo "  title=$TITLE"
    echo "  external_id=$KEY_HASH"
    echo "  creator_id=Hammer Creative"
    continue
  fi

  echo "→ Uploading: $S3_PATH"

  UPLOAD_URL=$(curl -s -X POST https://api.mux.com/video/v1/uploads \
    -u "$MUX_TOKEN_ID:$MUX_TOKEN_SECRET" \
    -H "Content-Type: application/json" \
    -d "{
      \"new_asset_settings\": {
        \"playback_policy\": [\"public\"],
        \"video_quality\": \"plus\",
        \"max_resolution_tier\": \"2160p\",
        \"meta\": {
          \"title\": \"$TITLE\",
          \"creator_id\": \"Hammer Creative\",
          \"external_id\": \"$KEY_HASH\"
        }
      }
    }" | jq -r '.data.url')

  aws s3 cp "$S3_PATH" - --profile "$PROFILE" \
  | pv -p -t -e -r -b -N "$RAW_FILENAME" \
  | curl -s -X PUT "$UPLOAD_URL" \
      --upload-file - \
      -H "Content-Type: application/octet-stream"

  echo "$KEY_HASH" >> "$STATE_FILE"
  echo "✓ Done"
done
