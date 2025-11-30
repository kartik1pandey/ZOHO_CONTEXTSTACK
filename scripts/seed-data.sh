#!/bin/bash

echo "🌱 Seeding sample data..."

# Wait for backend to be ready
echo "Waiting for backend..."
until curl -s http://localhost:4000/health > /dev/null; do
  sleep 2
done

echo "✅ Backend ready!"

# Seed messages
echo "📨 Seeding messages..."
curl -X POST http://localhost:4000/api/messages/ingest \
  -H "Content-Type: application/json" \
  -d @data/sample/messages.json

echo ""

# Seed docs
echo "📄 Seeding documents..."
curl -X POST http://localhost:4000/api/docs/ingest \
  -H "Content-Type: application/json" \
  -d @data/sample/docs.json

echo ""
echo "✅ Sample data loaded successfully!"
echo ""
echo "🚀 Open http://localhost:5173 to see the app"
