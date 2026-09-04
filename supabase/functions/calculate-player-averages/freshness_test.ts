// index.ts calls serve() at module load, which would bind a listener and
// hang `deno test` if imported directly. assertFresh/addDays live in
// ../_shared/freshness.ts for exactly this reason (see the comment there and
// in index.ts) — import from there, not from ./index.ts.
import {
  assertRejects,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { assertFresh } from "../_shared/freshness.ts";

// Games every day; logs 5 days behind -> must refuse.
Deno.test("refuses to publish when logs lag live play", async () => {
  await assertRejects(
    () => assertFresh("2026-03-10", "2026-03-15", () => Promise.resolve(true)),
    Error,
    "Refusing to publish",
  );
});

// Games every day; logs current -> must pass.
Deno.test("publishes when logs reach the latest game day", async () => {
  await assertFresh("2026-03-15", "2026-03-15", () => Promise.resolve(true));
});

// Within tolerance (2 game days) -> must pass.
Deno.test("tolerates a two-game-day lag", async () => {
  await assertFresh("2026-03-13", "2026-03-15", () => Promise.resolve(true));
});

// Offseason: no games anywhere -> must pass, however old the logs are.
Deno.test("passes for a finished season with no recent games", async () => {
  await assertFresh("2026-04-12", "2026-09-04", () => Promise.resolve(false));
});
