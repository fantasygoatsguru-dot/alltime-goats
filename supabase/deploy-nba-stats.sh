#!/bin/bash

# NBA Stats System Deployment Script
set -e

echo "🏀 Deploying NBA Stats System..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Step 1: Apply database migrations
echo "📊 Applying database migrations..."
supabase db push

echo "✅ Migrations applied"
echo ""

# Step 2: Deploy Edge Functions
echo "⚡ Deploying Edge Functions..."

echo "  📦 Deploying retrieve-nba-stats..."
supabase functions deploy retrieve-nba-stats

echo "  📦 Deploying calculate-player-averages..."
supabase functions deploy calculate-player-averages

echo "  📦 Deploying update-nba-stats (orchestrator)..."
supabase functions deploy update-nba-stats

echo ""
echo "✅ All Edge Functions deployed"
echo ""

# Step 3: Show next steps
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Test the retrieve function:"
echo "   curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/retrieve-nba-stats \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'Authorization: Bearer YOUR-ANON-KEY' \\"
echo "     -d '{\"daysBack\": 1, \"season\": \"2024-25\"}'"
echo ""
echo "2. Test the calculate function:"
echo "   curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/calculate-player-averages \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'Authorization: Bearer YOUR-ANON-KEY' \\"
echo "     -d '{\"season\": \"2024-25\"}'"
echo ""
echo "3. Or use the orchestrator to run both:"
echo "   curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/update-nba-stats \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'Authorization: Bearer YOUR-ANON-KEY' \\"
echo "     -d '{\"daysBack\": 7, \"season\": \"2024-25\"}'"
echo ""
echo "4. Schedule with cron (optional):"
echo "   Add a cron job to run update-nba-stats daily"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

