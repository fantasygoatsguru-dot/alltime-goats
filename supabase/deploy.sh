#!/bin/bash

# Supabase Deployment Script for Yahoo Fantasy Integration
# This script helps deploy the complete Supabase setup

set -e

echo "🚀 Starting Supabase deployment..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "🔐 Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

echo "✅ Logged in to Supabase"
echo ""

# Check if linked to a project
echo "🔗 Checking project link..."
if [ ! -f .supabase/config.toml ]; then
    echo "❌ Not linked to a Supabase project. Please run:"
    echo "   supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Apply database migrations
echo "📊 Applying database migrations..."
if supabase db push; then
    echo "✅ Migrations applied successfully"
else
    echo "❌ Failed to apply migrations"
    exit 1
fi

echo ""

# Deploy Edge Functions
echo "⚡ Deploying Edge Functions..."

echo "  📦 Deploying yahoo-oauth..."
if supabase functions deploy yahoo-oauth; then
    echo "  ✅ yahoo-oauth deployed"
else
    echo "  ❌ Failed to deploy yahoo-oauth"
    exit 1
fi

echo ""

echo "  📦 Deploying yahoo-fantasy-api..."
if supabase functions deploy yahoo-fantasy-api; then
    echo "  ✅ yahoo-fantasy-api deployed"
else
    echo "  ❌ Failed to deploy yahoo-fantasy-api"
    exit 1
fi

echo ""
echo "✨ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Set Edge Function secrets in Supabase dashboard:"
echo "     - YAHOO_CLIENT_ID"
echo "     - YAHOO_CLIENT_SECRET"
echo "     - YAHOO_REDIRECT_URI"
echo ""
echo "  2. Update your .env.local file with Supabase credentials:"
echo "     - VITE_SUPABASE_URL"
echo "     - VITE_SUPABASE_ANON_KEY"
echo ""
echo "  3. Test the connection locally:"
echo "     npm run dev"
echo ""
echo "📚 For detailed setup instructions, see YAHOO_SETUP.md"

