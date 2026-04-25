import { Check, Flame, Pencil, Trash2 } from "lucide-react";
import type { CheckIns, Habit } from "@/lib/habits-types";
import { colorVar, colorVarSoft } from "@/lib/habits-types";
import {
  currentStreak, dailyEfficiency, efficiencyColorClass,
  habitMonthCompletion, isFuture, isToday, monthDays, weekChunks, ymd,
} from "@/lib/habits-utils";
import { HabitIcon } from "./HabitIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  monthDate: Date;
  habits: Habit[];
  checkIns: CheckIns;
  onToggle: (habitId: string, date: Date) => void;
  onEdit: (h: Habit) => void;
  onDelete: (h: Habit) => void;
}

const WEEK_TINTS = ["week-1", "week-2", "week-3", "week-4", "week-5"];

export function HabitGrid({ monthDate, habits, checkIns, onToggle, onEdit, onDelete }: Props) {
  const today = new Date();
  const days = monthDays(monthDate);
  const weeks = weekChunks(days);

  return (
    <div className="ht-card overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            <th
              rowSpan={2}
              className="sticky left-0 bg-card z-10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[180px]"
            >
              Daily Habits
            </th>
            {weeks.map((w, i) => (
              <th
                key={i}
                colSpan={w.length}
                className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider"
                style={{ color: `hsl(var(--week-${i + 1}))` }}
              >
                Week {i + 1}
              </th>
            ))}
            <th rowSpan={2} className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Completed</th>
            <th rowSpan={2} className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Streak</th>
          </tr>
          <tr className="border-b border-border bg-card">
            {weeks.map((w, wi) =>
              w.map((d) => (
                <th
                  key={ymd(d)}
                  className={cn(
                    "px-1 py-1 text-center text-[11px] font-medium bg-card",
                    isToday(d, today) ? "text-primary" : "text-muted-foreground"
                  )}
                  style={{
                    backgroundColor: isToday(d, today)
                      ? `hsl(var(--week-${wi + 1}) / 0.12)`
                      : undefined,
                  }}
                >
                  {d.getDate()}
                </th>
              ))
            )}
          </tr>
        </thead>

        <tbody>
          {habits.length === 0 && (
            <tr>
              <td colSpan={days.length + 3} className="py-12 text-center text-muted-foreground">
                No habits yet — click <span className="font-semibold text-foreground">+ Add Habit</span> to start.
              </td>
            </tr>
          )}
          {habits.map((h) => {
            const map = checkIns[h.id] ?? {};
            const { pct } = habitMonthCompletion(h, monthDate, checkIns, today);
            const streak = currentStreak(h, checkIns, today);
            return (
              <tr key={h.id} className="group border-b border-border last:border-b-0 transition-colors">
                <td className="sticky left-0 z-10 px-4 py-2 bg-card group-hover:bg-[hsl(var(--card))] min-w-[180px] shadow-[2px_0_6px_-4px_hsl(230_50%_2%/0.6)]">
                  <div className="flex items-center gap-2 bg-card">
                    <HabitIcon name={h.icon} className="h-4 w-4 shrink-0" style={{ color: colorVar(h.color) }} />
                    <span className="font-medium truncate">{h.name}</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onEdit(h)} aria-label={`Edit ${h.name}`}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => onDelete(h)} aria-label={`Delete ${h.name}`}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </td>
                {weeks.map((w, wi) =>
                  w.map((d) => {
                    const future = isFuture(d, today);
                    const checked = !!map[ymd(d)];
                    return (
                      <td key={ymd(d)} className="px-0.5 py-1.5 text-center">
                        <button
                          type="button"
                          disabled={future}
                          onClick={() => onToggle(h.id, d)}
                          className={cn("ht-cell mx-auto", future && "ht-cell-disabled")}
                          style={{
                            borderColor: colorVar(h.color),
                            backgroundColor: checked ? colorVar(h.color) : colorVarSoft(h.color, 0.06),
                          }}
                          aria-label={`${h.name} on ${ymd(d)}`}
                          aria-pressed={checked}
                        >
                          {checked && (
                            <Check
                              className="h-4 w-4 animate-pop-in"
                              style={{ color: "hsl(var(--background))" }}
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      </td>
                    );
                  })
                )}
                <td className="px-3 py-2 text-center font-semibold tabular-nums" style={{ color: colorVar(h.color) }}>
                  {pct}%
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="inline-flex items-center gap-1 font-semibold tabular-nums" style={{ color: colorVar(h.color) }}>
                    {streak}
                    <Flame className="h-3.5 w-3.5" />
                  </span>
                </td>
              </tr>
            );
          })}

          {habits.length > 0 && (
            <tr className="border-t border-border">
              <td className="sticky left-0 z-10 bg-card px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-[2px_0_6px_-4px_hsl(230_50%_2%/0.6)]">
                Daily Efficiency
                <div className="text-[10px] font-normal normal-case tracking-normal text-muted-foreground/70">
                  (All Habits)
                </div>
              </td>
              {weeks.map((w, wi) =>
                w.map((d) => {
                  const future = isFuture(d, today);
                  const pct = future ? null : dailyEfficiency(habits, d, checkIns);
                  return (
                    <td key={ymd(d)} className="px-0.5 py-2 text-center text-[11px] font-semibold tabular-nums">
                      {pct === null ? (
                        <span className="text-muted-foreground/30">—</span>
                      ) : (
                        <span className={efficiencyColorClass(pct)}>{pct}%</span>
                      )}
                    </td>
                  );
                })
              )}
              <td colSpan={2} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
