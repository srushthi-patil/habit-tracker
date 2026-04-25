import type { CheckIns, Habit } from "@/lib/habits-types";
import { colorVar, colorVarSoft } from "@/lib/habits-types";
import { habitMonthCompletion } from "@/lib/habits-utils";
import { HabitIcon } from "./HabitIcon";

interface Props {
  monthDate: Date;
  habits: Habit[];
  checkIns: CheckIns;
}

export function OverallArcs({ monthDate, habits, checkIns }: Props) {
  const cx = 160;
  const cy = 150;
  const baseR = 40;
  const gap = 11;
  const stroke = 8;

  return (
    <div className="ht-card p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
        Overall Efficiency <span className="text-muted-foreground font-normal">(All Habits)</span>
      </h3>
      <div className="flex justify-center">
        <svg viewBox="0 0 320 180" className="w-full max-w-[340px] h-auto">
          {habits.map((h, i) => {
            const r = baseR + i * gap;
            const { pct } = habitMonthCompletion(h, monthDate, checkIns);
            const circ = Math.PI * r; // semicircle length
            const dash = (pct / 100) * circ;
            return (
              <g key={h.id}>
                <path
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke={colorVarSoft(h.color, 0.18)}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke={colorVar(h.color)}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ}`}
                  className="transition-all duration-700"
                />
                {/* % label at end */}
                <text
                  x={cx + r + 2}
                  y={cy - 4}
                  fontSize="10"
                  fontWeight="700"
                  fill={colorVar(h.color)}
                  textAnchor="start"
                >
                  {pct}%
                </text>
              </g>
            );
          })}
          <text x={cx - baseR - 30 + 0} y={cy + 16} fontSize="10" fill="hsl(var(--muted-foreground))">0</text>
          <text x={cx + baseR + 8 * gap} y={cy + 16} fontSize="10" fill="hsl(var(--muted-foreground))">100</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {habits.map((h) => {
          const { pct } = habitMonthCompletion(h, monthDate, checkIns);
          return (
            <div key={h.id} className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: colorVar(h.color) }} />
              <HabitIcon name={h.icon} className="h-3 w-3 shrink-0" style={{ color: colorVar(h.color) }} />
              <span className="truncate">{h.name} <span className="text-muted-foreground">({pct}%)</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
