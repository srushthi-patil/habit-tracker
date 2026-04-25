import type { CheckIns, Habit } from "@/lib/habits-types";
import { colorVar } from "@/lib/habits-types";
import { efficiencyColorClass, habitWeekCompletion, monthDays, weekChunks } from "@/lib/habits-utils";
import { HabitIcon } from "./HabitIcon";

interface Props {
  monthDate: Date;
  habits: Habit[];
  checkIns: CheckIns;
}

export function WeeklyTable({ monthDate, habits, checkIns }: Props) {
  const weeks = weekChunks(monthDays(monthDate));

  return (
    <div className="ht-card p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
        Weekly Efficiency <span className="text-muted-foreground font-normal">(Per Habit)</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="text-left py-2 pr-2">Habit</th>
              {weeks.map((_, i) => (
                <th key={i} className="px-2 py-2 text-center">W{i + 1}</th>
              ))}
              <th className="px-2 py-2 text-center">Avg</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((h) => {
              const pcts = weeks.map((w) => habitWeekCompletion(h, w, checkIns));
              const valid = pcts.filter((_, i) => weeks[i].length > 0);
              const avg = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0;
              return (
                <tr key={h.id} className="border-b border-border/50 last:border-b-0">
                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-2">
                      <HabitIcon name={h.icon} className="h-3.5 w-3.5 shrink-0" style={{ color: colorVar(h.color) }} />
                      <span className="text-xs font-medium truncate">{h.name}</span>
                    </div>
                  </td>
                  {pcts.map((p, i) => (
                    <td key={i} className={`px-2 py-2 text-center text-xs font-semibold tabular-nums ${efficiencyColorClass(p)}`}>
                      {p}%
                    </td>
                  ))}
                  <td className={`px-2 py-2 text-center text-xs font-bold tabular-nums ${efficiencyColorClass(avg)}`}>
                    {avg}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
