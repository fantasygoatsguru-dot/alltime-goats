import { assertEquals, assertThrows } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { STATS_SEASON, YAHOO_SEASON, seasonDateRange } from "./season.ts";
import { STATS_SEASON as FRONTEND_SEASON, HISTORICAL_STATS_SEASON } from "../../../src/config/season.js";

Deno.test("live season agrees across frontend, ingestion and Yahoo", () => {
  assertEquals(STATS_SEASON, "2026-27");
  assertEquals(FRONTEND_SEASON, STATS_SEASON);
  assertEquals(YAHOO_SEASON, "2026");
  assertEquals(HISTORICAL_STATS_SEASON, "2025-26");
});

Deno.test("season boundaries follow requested backfill year", () => {
  assertEquals(seasonDateRange("2026-27"), { start: "2026-07-01", end: "2027-06-30" });
  assertEquals(seasonDateRange("2025-26"), { start: "2025-07-01", end: "2026-06-30" });
  assertThrows(() => seasonDateRange("2026-28"));
});
