import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateZakat,
  cities,
  cityDate,
  prayersForDate,
  nextPrayer,
  formatTime,
  countdown,
  fastingForDate,
  hijriParts,
  upcomingFasts,
  dateKey,
} from '../src/lib/islam';

test('zakat maal: 2.5% after debts, nisab and haul', () => {
  const result = calculateZakat('maal', 200_000_000, 20_000_000, 1_500_000, 1, 15000, true);
  assert.equal(result.base, 180_000_000);
  assert.equal(result.nisab, 127_500_000);
  assert.equal(result.total, 4_500_000);
  assert.equal(result.eligible, true);
});
test('maal below nisab is not liable', () =>
  assert.equal(calculateZakat('maal', 10_000_000, 0, 1_500_000, 1, 15000, true).total, 0));
test('maal without haul is not liable', () =>
  assert.equal(calculateZakat('maal', 200_000_000, 0, 1_500_000, 1, 15000, false).eligible, false));
test('maal at nisab boundary is liable', () =>
  assert.equal(calculateZakat('maal', 127_500_000, 0, 1_500_000, 1, 15000, true).total, 3_187_500));
test('debts cannot make the asset base negative', () =>
  assert.equal(calculateZakat('maal', 100, 200, 100, 1, 0, true).base, 0));
test('monthly income uses a twelfth of annual nisab, no haul', () => {
  const r = calculateZakat('penghasilan', 12_000_000, 5_000_000, 1_500_000, 1, 15000, false);
  assert.equal(r.nisab, 10_625_000);
  assert.equal(r.total, 300_000);
});
test('fitrah uses 2.5 kilograms per person', () =>
  assert.equal(calculateZakat('fitrah', 0, 0, 0, 4, 15000, false).total, 150_000));
test('fitrah rounds down fractional household count defensively', () =>
  assert.equal(calculateZakat('fitrah', 0, 0, 0, 2.4, 10000, false).total, 50_000));
test('invalid gold price cannot make zakat eligible', () => {
  for (const gold of [0, -5, NaN, Infinity])
    assert.equal(calculateZakat('maal', 200_000_000, 0, gold, 1, 15000, true).eligible, false);
});
test('invalid or negative numeric input never creates a negative total', () => {
  for (const value of [-100, NaN, Infinity]) {
    assert.equal(calculateZakat('maal', value, 0, 100, 1, 0, true).total, 0);
    assert.equal(calculateZakat('fitrah', 0, 0, 0, value, 15000, false).total, 0);
  }
});
test('prayer times are ordered and finite for every supported city', () => {
  for (const city of cities) {
    const prayers = prayersForDate(new Date(2026, 9, 13), city);
    assert.equal(prayers.length, 5);
    prayers.forEach((p, i) => {
      assert.ok(Number.isFinite(p.time.getTime()));
      if (i) assert.ok(p.time > prayers[i - 1].time);
    });
  }
});
test('next prayer after Isya is the following day’s Subuh', () => {
  const prayers = prayersForDate(new Date(2026, 9, 13), cities[0]);
  const after = new Date(prayers[4].time.getTime() + 60_000);
  const next = nextPrayer(after, cities[0]);
  assert.equal(next.name, 'Subuh');
  assert.ok(next.time > after);
  assert.equal(formatTime(next.time, cities[0]).length, 5);
});
test('city dates respect midnight in WIB versus WIT', () => {
  const now = new Date('2026-10-13T16:30:00Z');
  assert.equal(dateKey(cityDate(now, cities[0])), '2026-10-13');
  assert.equal(dateKey(cityDate(now, cities[9])), '2026-10-14');
});
test('countdown supports hours and clamps elapsed dates to zero', () => {
  assert.equal(countdown(new Date(3661000), new Date(0)), '01 : 01 : 01');
  assert.equal(countdown(new Date(0), new Date(1000)), '00 : 00 : 00');
});
test('Monday is recommended outside prohibited and Ramadan days', () => {
  const date = new Date(2026, 9, 19, 12);
  assert.equal(fastingForDate(date).name, 'Puasa Senin');
});
test('prohibited days take priority over weekly and Ayyamul Bidh fasts', () => {
  let count = 0;
  for (let i = 0; i < 365; i++) {
    const date = new Date(2026, 0, 1 + i, 12);
    const h = hijriParts(date);
    if ((h.month === 10 && h.day === 1) || (h.month === 12 && h.day >= 10 && h.day <= 13)) {
      assert.equal(fastingForDate(date).kind, 'forbidden');
      count++;
    }
  }
  assert.equal(count, 5);
});
test('all Ramadan days are marked wajib regardless of weekday', () => {
  let count = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(2026, 0, 1 + i, 12);
    if (hijriParts(d).month === 9) {
      assert.equal(fastingForDate(d).kind, 'ramadan');
      count++;
    }
  }
  assert.ok(count >= 29 && count <= 30);
});
test('upcoming fasts are ordered, skip forbidden days, and return requested count', () => {
  const from = new Date(2026, 4, 25, 12);
  const upcoming = upcomingFasts(from, 6);
  assert.equal(upcoming.length, 6);
  upcoming.forEach((f, i) => {
    assert.ok(f.date >= from);
    assert.notEqual(f.kind, 'forbidden');
    if (i) assert.ok(f.date > upcoming[i - 1].date);
  });
});
