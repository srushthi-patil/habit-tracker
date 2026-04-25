import { Bot, Calendar, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import type { CheckIns, Habit } from "@/lib/habits-types";
import { colorVar } from "@/lib/habits-types";
import { bestWeekday, habitMonthCompletion, skipPattern } from "@/lib/habits-utils";

interface Props {
  monthDate: Date;
  habits: Habit[];
  checkIns: CheckIns;
}

export function InsightsBar({ monthDate, habits, checkIns }: Props) {
  if (habits.length === 0) return null;

  const sorted = [...habits]
    .map((h) => ({ h, pct: habitMonthCompletion(h, monthDate, checkIns).pct }))
    .sort((a, b) => b.pct - a.pct);

  const top = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const best = bestWeekday(habits, monthDate, checkIns);
  const skip = skipPattern(habits, monthDate, checkIns);

  return (
    <div className="ht-card p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
      <div className="flex items-center gap-3 md:border-r md:border-border md:pr-4">
        <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div className="font-bold uppercase tracking-wider text-sm">AI Insights</div>
      </div>

      <InsightCard
        icon={<TrendingDown className="h-4 w-4" />}
        title={skip ? `You skip ${skip.habit.name} after ${skip.avgGap}-${skip.avgGap + 1} days` : "Keep tracking to spot patterns"}
        sub="Try to stay consistent!"
        color={skip ? colorVar(skip.habit.color) : undefined}
      />
      <InsightCard
        icon={<Calendar className="h-4 w-4" />}
        title={best ? `Your best day is ${best.name}` : "More data needed"}
        sub={best ? "You're most productive!" : "Check off a few more days."}
      />
      <InsightCard
        icon={<Sparkles className="h-4 w-4" />}
        title={top ? `Great job on ${top.h.name} (${top.pct}%)` : ""}
        sub="Keep that streak alive."
        color={top ? colorVar(top.h.color) : undefined}
      />
      <InsightCard
        icon={<TrendingUp className="h-4 w-4" />}
        title={weakest ? `Try to improve ${weakest.h.name}` : ""}
        sub={weakest ? `You can do better — currently ${weakest.pct}%.` : ""}
        color={weakest ? colorVar(weakest.h.color) : undefined}
      />
    </div>
  );
}

function InsightCard({ icon, title, sub, color }: { icon: React.ReactNode; title: string; sub: string; color?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0" style={color ? { color } : undefined}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold leading-tight">{title}</div>
        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
