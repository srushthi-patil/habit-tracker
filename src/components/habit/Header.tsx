import { format } from "date-fns";
import { ChevronLeft, ChevronRight, ClipboardList, Moon, Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  monthDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onAdd: () => void;
}

export function Header({ monthDate, onPrev, onNext, onToday, theme, onToggleTheme, onAdd }: Props) {
  return (
    <header className="flex flex-wrap items-center gap-3 justify-between">
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Habit Tracker</h1>
      </div>

      <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onPrev} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <button
          onClick={onToday}
          className="px-3 h-8 text-sm font-semibold rounded hover:bg-secondary transition-colors min-w-[120px]"
          aria-label="Jump to current month"
        >
          {format(monthDate, "MMMM yyyy")}
        </button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onNext} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button onClick={onAdd} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>
    </header>
  );
}
