# Supabase Setup for Yahoo Fantasy Integration

This directory contains the Supabase configuration for the Yahoo Fantasy Sports integration.

## Directory Structure

```
supabase/
├── config.toml                          # Supabase project configuration
├── migrations/
│   └── 20250101000000_create_yahoo_fantasy_tables.sql  # Database schema
├── functions/
│   ├── yahoo-oauth/
│   │   └── index.ts                     # OAuth authentication function
│   └── yahoo-fantasy-api/
│       └── index.ts                     # Yahoo Fantasy API wrapper
└── README.md                            # This file
```

## Quick Start

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
# If you have an existing project
supabase link --project-ref your-project-ref

# Or initialize a new project
supabase init
```

### 4. Apply Migrations

```bash
supabase db push
```

This will create the following tables:
- `yahoo_tokens` - Stores OAuth access and refresh tokens
- `yahoo_matchups` - Caches matchup data
- `yahoo_fantasy_players` - Stores player information

### 5. Deploy Edge Functions

```bash
# Deploy OAuth handler
supabase functions deploy yahoo-oauth

# Deploy Fantasy API wrapper
supabase functions deploy yahoo-fantasy-api
```

### 6. Set Secrets

Navigate to your Supabase dashboard:
**Project Settings > Edge Functions > Secrets**

Add these environment variables:
```
YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
YAHOO_REDIRECT_URI=https://yourdomain.com/matchup
```

## Database Schema

### yahoo_tokens

Stores OAuth tokens for authenticated users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Yahoo user ID (unique) |
| access_token | TEXT | OAuth access token |
| refresh_token | TEXT | OAuth refresh token |
| token_type | TEXT | Token type (bearer) |
| expires_at | TIMESTAMPTZ | Token expiration time |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

### yahoo_matchups

Caches matchup data to reduce API calls.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Yahoo user ID |
| league_id | TEXT | Yahoo league ID |
| matchup_week | INTEGER | Week number |
| team1_key | TEXT | Team 1 key |
| team1_name | TEXT | Team 1 name |
| team2_key | TEXT | Team 2 key |
| team2_name | TEXT | Team 2 name |
| matchup_data | JSONB | Full matchup data |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

### yahoo_fantasy_players

Caches player information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| player_key | TEXT | Yahoo player key (unique) |
| player_name | TEXT | Player full name |
| team_key | TEXT | NBA team key |
| team_name | TEXT | NBA team name |
| position_type | TEXT | Position type |
| eligible_positions | TEXT[] | Array of eligible positions |
| stats | JSONB | Player statistics |
| season | TEXT | Season (default: 2025-26) |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

## Edge Functions

### yahoo-oauth

Handles Yahoo OAuth 2.0 authentication flow.

**Actions:**
- `authorize` - Get authorization URL
- `callback` - Exchange authorization code for tokens
- `refresh` - Refresh expired access token

**Request:**
```json
{
  "action": "authorize|callback|refresh",
  "code": "auth_code",      // For callback
  "userId": "user_id"       // For refresh
}
```

### yahoo-fantasy-api

Wrapper for Yahoo Fantasy Sports API.

**Actions:**
- `getUserLeagues` - Get user's leagues
- `getCurrentMatchup` - Get current week's matchup
- `getPlayerStats` - Get player statistics

**Request:**
```json
{
  "action": "getUserLeagues|getCurrentMatchup|getPlayerStats",
  "userId": "user_id",
  "leagueId": "league_id",  // For getCurrentMatchup
  "playerKeys": []           // For getPlayerStats
}
```

## Local Development

### Start Supabase Locally

```bash
supabase start
```

This will start:
- PostgreSQL database on port 54322
- Supabase Studio on port 54323
- API server on port 54321
- Edge Functions on port 54325

### Test Edge Functions Locally

```bash
# Serve functions locally
supabase functions serve

# Test with curl
curl -X POST http://localhost:54321/functions/v1/yahoo-oauth \
  -H "Content-Type: application/json" \
  -d '{"action": "authorize"}'
```

### View Logs

```bash
# View Edge Function logs
supabase functions logs yahoo-oauth

# View database logs
supabase db logs
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled. Policies ensure:
- Users can only access their own tokens
- Users can only access their own matchups
- Player data is publicly readable

### Environment Variables

Never commit these to version control:
- `YAHOO_CLIENT_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

Use Supabase dashboard to set Edge Function secrets.

## Monitoring

### Check Function Invocations

```bash
supabase functions inspect yahoo-oauth
supabase functions inspect yahoo-fantasy-api
```

### Database Queries

Use Supabase Studio or CLI to inspect data:

```bash
supabase db dump --table yahoo_tokens
```

## Troubleshooting

### Function Not Working

1. Check logs:
   ```bash
   supabase functions logs
   ```

2. Verify secrets are set:
   ```bash
   supabase secrets list
   ```

3. Redeploy:
   ```bash
   supabase functions deploy yahoo-oauth --no-verify-jwt
   ```

### Database Issues

1. Check migrations:
   ```bash
   supabase db diff
   ```

2. Reset database (local only):
   ```bash
   supabase db reset
   ```

### Token Expired

Implement automatic token refresh in the frontend:

```javascript
const refreshToken = async (userId) => {
  const { data } = await supabase.functions.invoke('yahoo-oauth', {
    body: { action: 'refresh', userId }
  });
  return data;
};
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Yahoo Fantasy API](https://developer.yahoo.com/fantasysports/guide/)
- [OAuth 2.0 Guide](https://developer.yahoo.com/oauth2/guide/)

## Support

For issues or questions:
1. Check the main project README
2. Review YAHOO_SETUP.md for detailed setup instructions
3. Check Supabase logs for errors
4. Consult Yahoo Developer documentation

