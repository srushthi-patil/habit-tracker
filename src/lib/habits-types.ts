export type HabitColor =
  | "rose" | "violet" | "sky" | "pink" | "emerald" | "coral" | "amber";

export type HabitIconName =
  | "Dumbbell" | "BookOpen" | "Droplet" | "Flower2" | "BookMarked"
  | "Candy" | "Sun" | "Moon" | "Coffee" | "Heart" | "Music" | "Bike"
  | "Apple" | "Pencil" | "Smile" | "Brain" | "Footprints" | "Leaf";

export interface Habit {
  id: string;
  name: string;
  icon: HabitIconName;
  color: HabitColor;
  createdAt: string; // ISO
}

// checkIns: { [habitId]: { [YYYY-MM-DD]: true } }
export type CheckIns = Record<string, Record<string, boolean>>;

export const HABIT_COLORS: HabitColor[] = [
  "rose", "violet", "sky", "pink", "emerald", "coral", "amber",
];

export const HABIT_ICONS: HabitIconName[] = [
  "Dumbbell", "BookOpen", "Droplet", "Flower2", "BookMarked",
  "Candy", "Sun", "Moon", "Coffee", "Heart", "Music", "Bike",
  "Apple", "Pencil", "Smile", "Brain", "Footprints", "Leaf",
];

export const colorVar = (c: HabitColor) => `hsl(var(--habit-${c}))`;
export const colorVarSoft = (c: HabitColor, alpha = 0.15) =>
  `hsl(var(--habit-${c}) / ${alpha})`;
