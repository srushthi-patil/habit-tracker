import { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { useHabits } from "@/hooks/useHabits";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/habit/Header";
import { HabitGrid } from "@/components/habit/HabitGrid";
import { WeeklyTable } from "@/components/habit/WeeklyTable";
import { MonthlyBars } from "@/components/habit/MonthlyBars";
import { OverallArcs } from "@/components/habit/OverallArcs";
import { InsightsBar } from "@/components/habit/InsightsBar";
import { HabitDialog } from "@/components/habit/HabitDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Habit } from "@/lib/habits-types";
import { toast } from "sonner";

const Index = () => {
  const { habits, checkIns, addHabit, updateHabit, deleteHabit, toggleCheck } = useHabits();
  const { theme, toggle } = useTheme();

  const [monthDate, setMonthDate] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Habit | null>(null);

  const openAdd = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (h: Habit) => { setEditing(h); setDialogOpen(true); };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <Header
          monthDate={monthDate}
          onPrev={() => setMonthDate((d) => subMonths(d, 1))}
          onNext={() => setMonthDate((d) => addMonths(d, 1))}
          onToday={() => {
            const t = new Date();
            setMonthDate(new Date(t.getFullYear(), t.getMonth(), 1));
          }}
          theme={theme}
          onToggleTheme={toggle}
          onAdd={openAdd}
        />

        <HabitGrid
          monthDate={monthDate}
          habits={habits}
          checkIns={checkIns}
          onToggle={toggleCheck}
          onEdit={openEdit}
          onDelete={(h) => setPendingDelete(h)}
        />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <WeeklyTable monthDate={monthDate} habits={habits} checkIns={checkIns} />
          <MonthlyBars monthDate={monthDate} habits={habits} checkIns={checkIns} />
          <OverallArcs monthDate={monthDate} habits={habits} checkIns={checkIns} />
        </section>

        <InsightsBar monthDate={monthDate} habits={habits} checkIns={checkIns} />
      </div>

      <HabitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSave={(data) => {
          if (editing) {
            updateHabit(editing.id, data);
            toast.success("Habit updated");
          } else {
            addHabit(data);
            toast.success("Habit added");
          }
        }}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pendingDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the habit and all its check-ins. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingDelete) {
                  deleteHabit(pendingDelete.id);
                  toast.success(`Deleted ${pendingDelete.name}`);
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default Index;
