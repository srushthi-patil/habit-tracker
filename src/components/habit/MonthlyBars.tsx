import type { CheckIns, Habit } from "@/lib/habits-types";
import { colorVar, colorVarSoft } from "@/lib/habits-types";
import { habitMonthCompletion } from "@/lib/habits-utils";
import { HabitIcon } from "./HabitIcon";

interface Props {
  monthDate: Date;
  habits: Habit[];
  checkIns: CheckIns;
}

export function MonthlyBars({ monthDate, habits, checkIns }: Props) {
  return (
    <div className="ht-card p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
        Monthly Efficiency <span className="text-muted-foreground font-normal">(Per Habit)</span>
      </h3>
      <div className="space-y-3">
        {habits.map((h) => {
          const { pct } = habitMonthCompletion(h, monthDate, checkIns);
          return (
            <div key={h.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-36 shrink-0">
                <HabitIcon name={h.icon} className="h-3.5 w-3.5 shrink-0" style={{ color: colorVar(h.color) }} />
                <span className="text-xs font-medium truncate">{h.name}</span>
              </div>
              <div
                className="relative h-3 flex-1 rounded-full overflow-hidden"
                style={{ backgroundColor: colorVarSoft(h.color, 0.15) }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: colorVar(h.color) }}
                />
              </div>
              <span className="text-xs font-bold tabular-nums w-10 text-right" style={{ color: colorVar(h.color) }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
