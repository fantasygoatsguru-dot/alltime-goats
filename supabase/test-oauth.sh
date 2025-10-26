#!/bin/bash

# Test script for Yahoo OAuth Edge Function
# This helps verify the function is working before testing in the UI

SUPABASE_URL="https://fqrnmcnvrrujiutstkgb.supabase.co"
FUNCTION_URL="${SUPABASE_URL}/functions/v1/yahoo-oauth"

echo "🧪 Testing Yahoo OAuth Edge Function"
echo "URL: $FUNCTION_URL"
echo ""

# Test 1: Authorize action
echo "Test 1: Testing 'authorize' action..."
echo "Request body: {\"action\":\"authorize\"}"
echo ""

RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"authorize"}')

echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if authUrl is in response
if echo "$RESPONSE" | grep -q "authUrl"; then
    echo "✅ Test 1 PASSED: Received authUrl"
else
    echo "❌ Test 1 FAILED: No authUrl in response"
fi

echo ""
echo "---"
echo ""

# Test 2: Invalid action
echo "Test 2: Testing invalid action..."
echo "Request body: {\"action\":\"invalid\"}"
echo ""

RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"invalid"}')

echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if error message mentions valid actions
if echo "$RESPONSE" | grep -q "Valid actions"; then
    echo "✅ Test 2 PASSED: Error message shows valid actions"
else
    echo "❌ Test 2 FAILED: Error message doesn't show valid actions"
fi

echo ""
echo "---"
echo ""

# Test 3: Missing action
echo "Test 3: Testing missing action..."
echo "Request body: {}"
echo ""

RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if error mentions action required
if echo "$RESPONSE" | grep -q "required"; then
    echo "✅ Test 3 PASSED: Error mentions action is required"
else
    echo "❌ Test 3 FAILED: Error doesn't mention action requirement"
fi

echo ""
echo "=================================================="
echo ""
echo "📋 To view detailed logs, run:"
echo "   supabase functions logs yahoo-oauth --project-ref fqrnmcnvrrujiutstkgb"
echo ""
echo "💡 If tests fail, check that environment secrets are set:"
echo "   - YAHOO_CLIENT_ID"
echo "   - YAHOO_CLIENT_SECRET"
echo "   - YAHOO_REDIRECT_URI"
echo ""

