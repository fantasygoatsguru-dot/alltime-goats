import { assertEquals, assertThrows } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import calendar from "../../../public/data/weeks.json" with { type: "json" };
import { easternDate, fantasyWeekForDate, matchupDates } from "./fantasy-calendar.ts";

Deno.test("NBA Cup matchup spans both calendar weeks", () => {
  const weeks = calendar.weeks;
  assertEquals(fantasyWeekForDate(weeks, "2026-11-30")?.number, 7);
  assertEquals(fantasyWeekForDate(weeks, "2026-12-13")?.number, 7);
  assertEquals(fantasyWeekForDate(weeks, "2026-12-14")?.number, 8);
  assertEquals(matchupDates(weeks, {}, new Date("2026-12-07T18:00:00Z")).numDaysInWeek, 14);
});

Deno.test("All-Star matchup spans both calendar weeks", () => {
  assertEquals(fantasyWeekForDate(calendar.weeks, "2027-02-15")?.number, 17);
  assertEquals(fantasyWeekForDate(calendar.weeks, "2027-02-28")?.number, 17);
  assertEquals(fantasyWeekForDate(calendar.weeks, "2027-03-01")?.number, 18);
  assertEquals(matchupDates(calendar.weeks, {}, new Date("2027-02-22T18:00:00Z")).numDaysInWeek, 14);
});

Deno.test("opening week and offseason do not use a seven-day approximation", () => {
  assertEquals(matchupDates(calendar.weeks, {}, new Date("2026-10-21T18:00:00Z")).numDaysInWeek, 6);
  assertEquals(fantasyWeekForDate(calendar.weeks, "2026-10-04"), null);
  assertThrows(() => matchupDates(calendar.weeks, {}, new Date("2026-10-04T18:00:00Z")));
});

Deno.test("explicit league dates override the default calendar", () => {
  const dates = matchupDates(calendar.weeks, { week_start: "2027-03-08", week_end: "2027-03-21" });
  assertEquals(dates.numDaysInWeek, 14);
  assertEquals(easternDate(dates.weekStart), "2027-03-08");
  assertEquals(easternDate(dates.weekEnd), "2027-03-21");
});

Deno.test("UTC midnight is still the previous Eastern day", () => {
  assertEquals(easternDate(new Date("2026-12-14T02:00:00Z")), "2026-12-13");
});
