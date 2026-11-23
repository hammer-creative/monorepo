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

REST="${ROOT#s3://}"
BUCKET="${REST%%/*}"
PREFIX=""
[[ "$REST" == */* ]] && PREFIX="${REST#*/}"

aws s3api list-objects-v2 \
  --bucket "$BUCKET" \
  --prefix "$PREFIX" \
  --query 'Contents[?Size > `0`].Key' \
  --output text \
  --profile "$PROFILE" \
| tr '\t' '\n' \
| { grep -Ei '\.(mp4|webm|vob|gifv|avi|mov|mkv)$' || true; } \
| while IFS= read -r key; do

  S3_PATH="s3://$BUCKET/$key"
  RAW_FILENAME="$(basename "$key")"

  # title: strip extension, convert underscores to spaces
  TITLE="$(echo "$RAW_FILENAME" | sed -E 's/\.[^.]+$//; s/_+/ /g')"

  # dedupe key
  KEY_HASH="$(printf "%s" "$key" | shasum -a 256 | cut -c1-32)"

  if grep -Fxq "$KEY_HASH" "$STATE_FILE"; then
    echo "SKIP: $S3_PATH"
    continue
  fi

  if $DRY_RUN; then
    echo "[DRY RUN] $S3_PATH"
    echo "  title=$TITLE"
    echo "  external_id=$KEY_HASH"
    echo "  creator_id=Hammer Creative"
    continue
  fi

  echo "Queueing: $S3_PATH"

  S3_URL="$(aws s3 presign "$S3_PATH" --expires-in 86400 --profile "$PROFILE")"

  BODY="$(jq -n \
    --arg input "$S3_URL" \
    --arg title "$TITLE" \
    --arg ext "$KEY_HASH" \
    '{
      input: $input,
      playback_policy: ["public"],
      video_quality: "plus",
      max_resolution_tier: "2160p",
      meta: {
        title: $title,
        creator_id: "Hammer Creative",
        external_id: $ext
      }
    }')"

  RESPONSE="$(curl -s -X POST https://api.mux.com/video/v1/assets \
    -u "$MUX_TOKEN_ID:$MUX_TOKEN_SECRET" \
    -H "Content-Type: application/json" \
    -d "$BODY")"

  ASSET_ID="$(echo "$RESPONSE" | jq -r '.data.id // empty')"

  if [[ -z "$ASSET_ID" ]]; then
    echo "FAILED: $S3_PATH"
    echo "$RESPONSE"
    continue
  fi

  echo "$KEY_HASH" >> "$STATE_FILE"
  echo "Queued: $TITLE ($ASSET_ID)"
done
