import { YAHOO_SEASON } from "./season.ts";

type YahooRequest = (endpoint: string) => Promise<any>;
const gameIds = new Map<string, string>();

export async function getYahooGameId(request: YahooRequest, season = YAHOO_SEASON): Promise<string> {
  const cached = gameIds.get(season);
  if (cached) return cached;
  const response = await request(`/games;game_codes=nba;seasons=${season}`);
  const entries = Object.values(response?.fantasy_content?.games ?? {});
  for (const entry of entries) {
    const raw = (entry as any)?.game;
    const game = Array.isArray(raw) ? Object.assign({}, ...raw) : raw;
    if (game?.code === "nba" && String(game.season) === season) {
      const gameId = String(game.game_key ?? game.game_id ?? "");
      if (/^\d+$/.test(gameId)) {
        gameIds.set(season, gameId);
        return gameId;
      }
    }
  }
  throw new Error(`Yahoo NBA game unavailable for season ${season}`);
}
