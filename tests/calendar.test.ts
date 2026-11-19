import assert from "node:assert/strict";
import test from "node:test";
import { dateKey, getMonthDays } from "../src/features/calendar/utils/dates.ts";

test("日付キーはローカル日付を使い、日付の前後でずれない", () => {
  assert.equal(dateKey(new Date(2026, 10, 19, 0, 0)), "2026-11-19");
  assert.equal(dateKey(new Date(2026, 10, 19, 23, 59)), "2026-11-19");
});

test("年をまたぐ前月・翌月の日付を含み、日曜から土曜まで並べる", () => {
  const days = getMonthDays(new Date(2026, 11, 1));
  assert.equal(dateKey(days[0]), "2026-11-29");
  assert.equal(dateKey(days.at(-1)!), "2027-01-02");
  assert.equal(days[0].getDay(), 0);
  assert.equal(days.at(-1)!.getDay(), 6);
  assert.equal(days.filter((day) => day.getMonth() === 11).length, 31);
});

test("うるう年の2月29日を表示する", () => {
  const days = getMonthDays(new Date(2024, 1, 1));
  assert.equal(days.filter((day) => day.getMonth() === 1).length, 29);
  assert.ok(days.some((day) => dateKey(day) === "2024-02-29"));
});

test("6週必要な月の末日を省略しない", () => {
  const days = getMonthDays(new Date(2026, 7, 1));
  assert.equal(days.length, 42);
  assert.equal(dateKey(days[0]), "2026-07-26");
  assert.equal(dateKey(days.at(-1)!), "2026-09-05");
  assert.equal(days.filter((day) => day.getMonth() === 7).length, 31);
});
