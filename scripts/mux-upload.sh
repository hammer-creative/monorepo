#!/bin/bash

S3_BUCKET="hc-evo-backup"
S3_PREFIX="HC_Website"

AWS_ACCESS_KEY_ID="AKIAYG7HEW4VGXCUOCXT"
AWS_SECRET_ACCESS_KEY="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"
AWS_DEFAULT_REGION="us-west-2"

MUX_TOKEN_ID="7e94d66f-f2c6-491b-b661-dcdd702693a3"
MUX_TOKEN_SECRET="Nkvh/z9vJTeMph7od288gnJQyhsdTcqcKlXgco5MSnXAgwoKzraDeSFNoFYgpTUXAFMvbac0FhH"

export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION

echo "Processing files from s3://${S3_BUCKET}/${S3_PREFIX}/"
echo "---"

# List and process video files
aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" --recursive | \
  grep -iE '\.(mp4|mov|avi|mkv)' | \
  while read -r date time size path; do
    if [ -z "$path" ] || [[ "$path" == */ ]]; then
      continue
    fi

    FILENAME=$(basename "$path")

    # Generate presigned URL (valid for 1 hour)
    S3_URL=$(aws s3 presign "s3://${S3_BUCKET}/${path}" --expires-in 3600)

    echo ""
    echo "========================================="
    echo "Processing: $FILENAME"
    echo "Size: $(numfmt --to=iec-i --suffix=B $size)"
    echo "========================================="

    # Create Mux asset directly from URL
    echo "Creating Mux asset from S3 URL..."
    ASSET_RESPONSE=$(curl -s -X POST https://api.mux.com/video/v1/assets \
      -u "${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}" \
      -H "Content-Type: application/json" \
      -d "{
        \"input\": \"${S3_URL}\",
        \"playback_policy\": [\"public\"],
        \"video_quality\": \"plus\",
        \"max_resolution_tier\": \"2160p\",
        \"mp4_support\": \"standard\"
      }")

    ASSET_ID=$(echo "$ASSET_RESPONSE" | jq -r '.data.id')

    if [ "$ASSET_ID" = "null" ] || [ -z "$ASSET_ID" ]; then
      echo "❌ Error creating asset for $FILENAME"
      echo "Response: $ASSET_RESPONSE"
      continue
    fi

    echo "✅ Asset created: $FILENAME (ID: $ASSET_ID)"
    echo "   Mux is now ingesting directly from S3..."
  done

echo ""
echo "========================================="
echo "All done! Check Mux dashboard for processing status."
echo "========================================="
