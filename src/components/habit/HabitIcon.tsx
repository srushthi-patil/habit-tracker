import {
  Dumbbell, BookOpen, Droplet, Flower2, BookMarked, Candy, Sun, Moon,
  Coffee, Heart, Music, Bike, Apple, Pencil, Smile, Brain, Footprints, Leaf,
  type LucideIcon,
} from "lucide-react";
import type { HabitIconName } from "@/lib/habits-types";

const MAP: Record<HabitIconName, LucideIcon> = {
  Dumbbell, BookOpen, Droplet, Flower2, BookMarked, Candy, Sun, Moon,
  Coffee, Heart, Music, Bike, Apple, Pencil, Smile, Brain, Footprints, Leaf,
};

interface Props { name: HabitIconName; className?: string; style?: React.CSSProperties; }

export function HabitIcon({ name, className, style }: Props) {
  const Icon = MAP[name] ?? Dumbbell;
  return <Icon className={className} style={style} />;
}
