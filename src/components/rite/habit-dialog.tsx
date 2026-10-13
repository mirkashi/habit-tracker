import { useState, type FormEvent } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { COLOR_LABEL, COLOR_UI } from "@/components/rite/colors";
import { cn } from "@/lib/cn";
import { HABIT_COLORS, MAX_NAME, type Habit, type HabitColor } from "@/lib/habits/logic";

export function HabitDialog({
  open,
  mode,
  initialName,
  initialColor,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "add" | "edit";
  initialName: string;
  initialColor: HabitColor;
  onClose: () => void;
  onSubmit: (name: string, color: HabitColor) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="rite-overlay fixed inset-0 z-50" />
        <Dialog.Content className="rite-dialog fixed top-1/2 right-4 left-4 z-50 max-h-[calc(100dvh-2rem)] -translate-y-1/2 overflow-y-auto rounded-xl border border-line bg-card p-4 outline-none sm:right-auto sm:left-1/2 sm:w-full sm:max-w-sm sm:-translate-x-1/2">
          {open ? (
            <HabitForm
              key={`${mode}:${initialName}:${initialColor}`}
              mode={mode}
              initialName={initialName}
              initialColor={initialColor}
              onClose={onClose}
              onSubmit={onSubmit}
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function HabitForm({
  mode,
  initialName,
  initialColor,
  onClose,
  onSubmit,
}: {
  mode: "add" | "edit";
  initialName: string;
  initialColor: HabitColor;
  onClose: () => void;
  onSubmit: (name: string, color: HabitColor) => void;
}) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState<HabitColor>(initialColor);
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = name.trim().replace(/\s+/g, " ");
    if (!next) {
      setError("Give this habit a name.");
      return;
    }
    if (next.length > MAX_NAME) {
      setError(`Keep the name under ${MAX_NAME} characters.`);
      return;
    }
    onSubmit(next, color);
  }

  return (
    <form onSubmit={submit}>
      <div className="flex items-start justify-between gap-3">
        <Dialog.Title className="font-display text-2xl leading-none font-medium text-ink">
          {mode === "add" ? "New habit" : "Edit habit"}
        </Dialog.Title>
        <Dialog.Close
          type="button"
          aria-label="Close"
          className="pressable flex size-11 items-center justify-center rounded-sm text-muted hover:bg-paper-deep hover:text-ink"
        >
          <X className="size-5" />
        </Dialog.Close>
      </div>
      <Dialog.Description className="mt-2 text-sm text-muted">
        {mode === "add"
          ? "Name something you can finish in a day. History starts today."
          : "The name and color change. Check-ins stay."}
      </Dialog.Description>

      <label htmlFor="habit-name" className="mt-5 block text-sm font-medium text-ink">
        Name
      </label>
      <input
        id="habit-name"
        value={name}
        autoFocus
        maxLength={MAX_NAME}
        autoComplete="off"
        onChange={(event) => {
          setName(event.target.value);
          if (error) setError("");
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "habit-name-error" : undefined}
        className="mt-2 h-11 w-full rounded-sm border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink"
      />
      {error ? (
        <p id="habit-name-error" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-ink">Color</legend>
        <p className="mt-1 text-sm text-muted">{COLOR_LABEL[color]} marks it on the calendar.</p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
          {HABIT_COLORS.map((option) => {
            const selected = option === color;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={COLOR_LABEL[option]}
                onClick={() => setColor(option)}
                className={cn(
                  "pressable flex size-11 items-center justify-center rounded-full",
                  COLOR_UI[option].dot,
                  selected && "ring-2 ring-ink ring-offset-2 ring-offset-card",
                )}
              >
                {selected ? <Check className="size-4 text-paper" strokeWidth={2.5} /> : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="pressable h-11 rounded-sm border border-line bg-card px-4 text-sm font-medium text-ink hover:bg-paper-deep"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="pressable h-11 rounded-sm bg-ink px-4 text-sm font-medium text-paper hover:opacity-90"
        >
          {mode === "add" ? "Add habit" : "Save"}
        </button>
      </div>
    </form>
  );
}

export function ConfirmRemove({
  habit,
  onCancel,
  onConfirm,
}: {
  habit: Habit | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={habit !== null} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="rite-overlay fixed inset-0 z-50" />
        <AlertDialog.Content className="rite-dialog fixed top-1/2 right-4 left-4 z-50 -translate-y-1/2 rounded-xl border border-line bg-card p-4 outline-none sm:right-auto sm:left-1/2 sm:w-full sm:max-w-sm sm:-translate-x-1/2">
          <AlertDialog.Title className="font-display text-2xl leading-none font-medium text-ink">
            Remove {habit?.name}?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted">
            Its check-ins will be deleted from this browser. This cannot be undone.
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel className="pressable h-11 rounded-sm border border-line bg-card px-4 text-sm font-medium text-ink hover:bg-paper-deep">
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={onConfirm}
              className="pressable h-11 rounded-sm bg-danger px-4 text-sm font-medium text-paper hover:opacity-90"
            >
              Remove
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
