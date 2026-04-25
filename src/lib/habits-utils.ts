import { format, getDaysInMonth, isSameMonth, startOfMonth, getDay } from "date-fns";
import type { CheckIns, Habit } from "./habits-types";

export const ymd = (d: Date) => format(d, "yyyy-MM-dd");

export function monthDays(monthDate: Date): Date[] {
  const total = getDaysInMonth(monthDate);
  const start = startOfMonth(monthDate);
  return Array.from({ length: total }, (_, i) => {
    const d = new Date(start);
    d.setDate(i + 1);
    return d;
  });
}

/** Group days into weeks. Each "week" = 7-day chunk starting day 1, 8, 15, 22, 29. */
export function weekChunks(days: Date[]): Date[][] {
  const chunks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) chunks.push(days.slice(i, i + 7));
  return chunks;
}

export function isFuture(d: Date, today = new Date()) {
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return a > b;
}

export function isToday(d: Date, today = new Date()) {
  return ymd(d) === ymd(today);
}

/** Days in month that are <= today (elapsed). If different month, returns all days. */
export function elapsedDays(monthDate: Date, today = new Date()): Date[] {
  const days = monthDays(monthDate);
  if (!isSameMonth(monthDate, today)) return days;
  return days.filter((d) => !isFuture(d, today));
}

export function habitMonthCompletion(
  habit: Habit, monthDate: Date, checkIns: CheckIns, today = new Date()
): { done: number; total: number; pct: number } {
  const days = elapsedDays(monthDate, today);
  const map = checkIns[habit.id] ?? {};
  const done = days.reduce((a, d) => a + (map[ymd(d)] ? 1 : 0), 0);
  const total = days.length || 1;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function habitWeekCompletion(
  habit: Habit, weekDays: Date[], checkIns: CheckIns, today = new Date()
): number {
  const elapsed = weekDays.filter((d) => !isFuture(d, today));
  if (elapsed.length === 0) return 0;
  const map = checkIns[habit.id] ?? {};
  const done = elapsed.reduce((a, d) => a + (map[ymd(d)] ? 1 : 0), 0);
  return Math.round((done / elapsed.length) * 100);
}

export function dailyEfficiency(
  habits: Habit[], day: Date, checkIns: CheckIns
): number {
  if (habits.length === 0) return 0;
  const key = ymd(day);
  const done = habits.reduce(
    (a, h) => a + ((checkIns[h.id]?.[key]) ? 1 : 0),
    0
  );
  return Math.round((done / habits.length) * 100);
}

export function currentStreak(
  habit: Habit, checkIns: CheckIns, today = new Date()
): number {
  const map = checkIns[habit.id] ?? {};
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // If today not done, allow starting from yesterday
  if (!map[ymd(cursor)]) cursor.setDate(cursor.getDate() - 1);
  while (map[ymd(cursor)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function efficiencyColorClass(pct: number) {
  if (pct >= 80) return "text-eff-high";
  if (pct >= 60) return "text-eff-mid";
  return "text-eff-low";
}

/** weekday with highest avg daily efficiency this month (0=Sun..6=Sat) */
export function bestWeekday(
  habits: Habit[], monthDate: Date, checkIns: CheckIns, today = new Date()
): { name: string; pct: number } | null {
  const days = elapsedDays(monthDate, today);
  if (days.length === 0 || habits.length === 0) return null;
  const buckets: { sum: number; count: number }[] = Array.from(
    { length: 7 }, () => ({ sum: 0, count: 0 })
  );
  for (const d of days) {
    const w = getDay(d);
    buckets[w].sum += dailyEfficiency(habits, d, checkIns);
    buckets[w].count += 1;
  }
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let best = -1, bestPct = -1;
  buckets.forEach((b, i) => {
    if (b.count === 0) return;
    const pct = b.sum / b.count;
    if (pct > bestPct) { bestPct = pct; best = i; }
  });
  if (best === -1) return null;
  return { name: names[best], pct: Math.round(bestPct) };
}

/** habit most often missed and avg gap between misses (rough) */
export function skipPattern(
  habits: Habit[], monthDate: Date, checkIns: CheckIns, today = new Date()
): { habit: Habit; avgGap: number } | null {
  if (habits.length === 0) return null;
  const days = elapsedDays(monthDate, today);
  if (days.length < 3) return null;
  let worst: Habit | null = null;
  let worstMisses = -1;
  let gap = 0;
  for (const h of habits) {
    const map = checkIns[h.id] ?? {};
    let misses = 0;
    let lastMissIdx = -1;
    const gaps: number[] = [];
    days.forEach((d, i) => {
      if (!map[ymd(d)]) {
        misses++;
        if (lastMissIdx >= 0) gaps.push(i - lastMissIdx);
        lastMissIdx = i;
      }
    });
    if (misses > worstMisses) {
      worstMisses = misses;
      worst = h;
      gap = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : days.length;
    }
  }
  if (!worst || worstMisses <= 0) return null;
  return { habit: worst, avgGap: gap };
}
