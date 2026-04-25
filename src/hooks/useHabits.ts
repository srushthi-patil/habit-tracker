import { useCallback, useEffect, useMemo, useState } from "react";
import type { CheckIns, Habit, HabitColor, HabitIconName } from "@/lib/habits-types";
import { ymd } from "@/lib/habits-utils";

const HABITS_KEY = "ht.habits.v1";
const CHECKINS_KEY = "ht.checkins.v1";
const SEEDED_KEY = "ht.seeded.v1";

const DEFAULT_HABITS: Omit<Habit, "id" | "createdAt">[] = [
  { name: "Gym", icon: "Dumbbell", color: "rose" },
  { name: "Study", icon: "BookOpen", color: "violet" },
  { name: "Water (8 glasses)", icon: "Droplet", color: "sky" },
  { name: "Meditation", icon: "Flower2", color: "pink" },
  { name: "Read Book", icon: "BookMarked", color: "emerald" },
  { name: "No Sugar", icon: "Candy", color: "coral" },
  { name: "Early Wake Up", icon: "Sun", color: "amber" },
];

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function seedCheckIns(habits: Habit[]): CheckIns {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const out: CheckIns = {};
  for (const h of habits) {
    out[h.id] = {};
    const cursor = new Date(start);
    // probability per habit
    const p = 0.55 + Math.random() * 0.35;
    while (cursor <= today) {
      if (Math.random() < p) out[h.id][ymd(cursor)] = true;
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return out;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => load<Habit[]>(HABITS_KEY, []));
  const [checkIns, setCheckIns] = useState<CheckIns>(() => load<CheckIns>(CHECKINS_KEY, {}));

  // Seed on first run
  useEffect(() => {
    if (localStorage.getItem(SEEDED_KEY)) return;
    if (habits.length > 0) {
      localStorage.setItem(SEEDED_KEY, "1");
      return;
    }
    const seeded: Habit[] = DEFAULT_HABITS.map((h) => ({
      ...h,
      id: uid(),
      createdAt: new Date().toISOString(),
    }));
    const seededChecks = seedCheckIns(seeded);
    setHabits(seeded);
    setCheckIns(seededChecks);
    localStorage.setItem(HABITS_KEY, JSON.stringify(seeded));
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(seededChecks));
    localStorage.setItem(SEEDED_KEY, "1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist
  useEffect(() => { localStorage.setItem(HABITS_KEY, JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns)); }, [checkIns]);

  const addHabit = useCallback((data: { name: string; icon: HabitIconName; color: HabitColor }) => {
    const habit: Habit = { ...data, id: uid(), createdAt: new Date().toISOString() };
    setHabits((p) => [...p, habit]);
    return habit;
  }, []);

  const updateHabit = useCallback((id: string, patch: Partial<Omit<Habit, "id" | "createdAt">>) => {
    setHabits((p) => p.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((p) => p.filter((h) => h.id !== id));
    setCheckIns((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
  }, []);

  const toggleCheck = useCallback((habitId: string, date: Date) => {
    const key = ymd(date);
    setCheckIns((p) => {
      const cur = p[habitId] ?? {};
      const next = { ...cur };
      if (next[key]) delete next[key]; else next[key] = true;
      return { ...p, [habitId]: next };
    });
  }, []);

  return useMemo(
    () => ({ habits, checkIns, addHabit, updateHabit, deleteHabit, toggleCheck }),
    [habits, checkIns, addHabit, updateHabit, deleteHabit, toggleCheck]
  );
}
