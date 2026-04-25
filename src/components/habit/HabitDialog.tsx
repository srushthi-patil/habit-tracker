import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HABIT_COLORS, HABIT_ICONS, type Habit, type HabitColor, type HabitIconName, colorVar } from "@/lib/habits-types";
import { HabitIcon } from "./HabitIcon";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Habit | null;
  onSave: (data: { name: string; icon: HabitIconName; color: HabitColor }) => void;
}

export function HabitDialog({ open, onOpenChange, initial, onSave }: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<HabitIconName>("Dumbbell");
  const [color, setColor] = useState<HabitColor>("violet");

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setIcon(initial?.icon ?? "Dumbbell");
      setColor(initial?.color ?? "violet");
    }
  }, [open, initial]);

  const submit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, color });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit habit" : "Add new habit"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Name</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning run"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-transform",
                    color === c ? "scale-110 border-foreground" : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: colorVar(c) }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-9 gap-2">
              {HABIT_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={cn(
                    "h-9 w-9 rounded-lg border flex items-center justify-center transition-colors",
                    icon === i
                      ? "border-foreground bg-secondary"
                      : "border-border hover:bg-secondary/50"
                  )}
                  aria-label={i}
                >
                  <HabitIcon name={i} className="h-4 w-4" style={{ color: colorVar(color) }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim()}>
            {initial ? "Save changes" : "Add habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
