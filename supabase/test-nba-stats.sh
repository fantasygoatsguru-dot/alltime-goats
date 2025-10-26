#!/bin/bash

# NBA Stats System Test Script
set -e

echo "🏀 Testing NBA Stats System"
echo ""

# Load environment variables if .env exists
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing environment variables"
    echo "   Set SUPABASE_URL and SUPABASE_ANON_KEY"
    exit 1
fi

SUPABASE_URL="${SUPABASE_URL%/}"  # Remove trailing slash if present

echo "📡 Using Supabase URL: $SUPABASE_URL"
echo ""

# Test 1: Retrieve NBA stats for yesterday
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: Retrieve NBA Stats (1 day back)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RETRIEVE_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/retrieve-nba-stats" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{"daysBack": 1, "season": "2024-25"}')

echo "$RETRIEVE_RESPONSE" | jq '.'

if echo "$RETRIEVE_RESPONSE" | jq -e '.success' > /dev/null; then
    echo ""
    echo "✅ Test 1 passed: Stats retrieved successfully"
else
    echo ""
    echo "❌ Test 1 failed: Stats retrieval failed"
    exit 1
fi

echo ""
echo "Waiting 3 seconds before next test..."
sleep 3
echo ""

# Test 2: Calculate player averages
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: Calculate Player Averages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

CALCULATE_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/calculate-player-averages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{"season": "2024-25"}')

echo "$CALCULATE_RESPONSE" | jq '.'

if echo "$CALCULATE_RESPONSE" | jq -e '.success' > /dev/null; then
    echo ""
    echo "✅ Test 2 passed: Averages calculated successfully"
else
    echo ""
    echo "❌ Test 2 failed: Averages calculation failed"
    exit 1
fi

echo ""
echo "Waiting 3 seconds before next test..."
sleep 3
echo ""

# Test 3: Orchestrator (both functions)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3: Update NBA Stats (Orchestrator)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ORCHESTRATOR_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/update-nba-stats" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{"daysBack": 1, "season": "2024-25"}')

echo "$ORCHESTRATOR_RESPONSE" | jq '.'

if echo "$ORCHESTRATOR_RESPONSE" | jq -e '.success' > /dev/null; then
    echo ""
    echo "✅ Test 3 passed: Orchestrator completed successfully"
else
    echo ""
    echo "❌ Test 3 failed: Orchestrator failed"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ All tests passed!"
echo ""
echo "📊 Summary:"
echo "  - NBA stats retrieval: ✅"
echo "  - Player averages calculation: ✅"
echo "  - Orchestrator workflow: ✅"
echo ""
echo "🎯 Next steps:"
echo "  1. Check data in Supabase dashboard"
echo "  2. Query player_game_logs table"
echo "  3. Query player_season_averages table"
echo "  4. Set up automated daily runs"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

