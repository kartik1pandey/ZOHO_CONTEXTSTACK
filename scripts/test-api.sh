#!/bin/bash

echo "🧪 Testing API endpoints..."

BASE_URL="http://localhost:4000"

echo ""
echo "1️⃣ Testing health check..."
curl -s "$BASE_URL/health" | jq .

echo ""
echo "2️⃣ Testing NLP health..."
curl -s "http://localhost:8000/health" | jq .

echo ""
echo "3️⃣ Fetching messages for dev-frontend..."
curl -s "$BASE_URL/api/messages/dev-frontend?limit=3" | jq '.[] | {messageId, text}'

echo ""
echo "4️⃣ Testing context extraction..."
curl -s -X POST "$BASE_URL/api/context" \
  -H "Content-Type: application/json" \
  -d '{"channelId":"dev-frontend","messageId":"M_001"}' \
  | jq '{actions: .actions, docsFound: (.relevantDocs | length), latency: .meta.latencyMs}'

echo ""
echo "✅ API tests complete!"