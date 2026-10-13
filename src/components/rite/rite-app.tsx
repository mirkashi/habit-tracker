import { useEffect, useMemo, useState, type ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { COLOR_UI } from "@/components/rite/colors";
import { ConfirmRemove, HabitDialog } from "@/components/rite/habit-dialog";
import { cn } from "@/lib/cn";
import {
  MAX_HABITS,
  addDays,
  addHabit,
  addMonths,
  canToggle,
  checkSet,
  dayNumber,
  deleteHabit,
  formatLong,
  formatMonth,
  formatWeekSpan,
  formatWeekday,
  habitStats,
  isChecked,
  loadState,
  monthGrid,
  monthKey,
  nextColor,
  percent,
  ratioInRange,
  saveState,
  startOfWeek,
  streakCaption,
  sumRatios,
  todayISO,
  toggleCheck,
  updateHabit,
  weekDates,
  type Habit,
  type HabitColor,
  type HabitState,
  type Ratio,
} from "@/lib/habits/logic";

type View = "week" | "month";
type Focus = "all" | string;
type Draft = { mode: "add" } | { mode: "edit"; habit: Habit } | null;

export function RiteApp() {
  const [state, setState] = useState<HabitState | null>(() =>
    typeof window === "undefined" ? null : loadState(),
  );
  const [today, setToday] = useState(todayISO);

  useEffect(() => {
    if (!state) setState(loadState());
  }, [state]);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  useEffect(() => {
    const sync = () => setToday(todayISO());
    document.addEventListener("visibilitychange", sync);
    const id = window.setInterval(sync, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(id);
    };
  }, []);

  if (!state) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 py-6">
        <p className="font-display text-3xl leading-none text-ink">Rite</p>
        <p className="mt-2 text-sm text-muted">Loading your habits…</p>
      </main>
    );
  }

  return <RiteBoard state={state} setState={setState} today={today} />;
}

function RiteBoard({
  state,
  setState,
  today,
}: {
  state: HabitState;
  setState: (value: HabitState | ((prev: HabitState | null) => HabitState | null)) => void;
  today: string;
}) {
  const [view, setView] = useState<View>("week");
  const [cursor, setCursor] = useState(today);
  const [focus, setFocus] = useState<Focus>("all");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(null);
  const [pendingDelete, setPendingDelete] = useState<Habit | null>(null);

  const { habits } = state;
  const activeFocus: Focus = focus !== "all" && habits.some((habit) => habit.id === focus) ? focus : "all";
  const shown = activeFocus === "all" ? habits : habits.filter((habit) => habit.id === activeFocus);

  const progress = useMemo(() => {
    const active = habits.filter((habit) => habit.createdAt <= today);
    const done = active.filter((habit) => isChecked(state, habit.id, today)).length;
    return { done, total: active.length };
  }, [habits, state, today]);

  const liveStreak = useMemo(() => {
    let best = 0;
    let name = "";
    for (const habit of habits) {
      const stats = habitStats(habit, checkSet(state, habit.id), today);
      if (stats.current > best) {
        best = stats.current;
        name = habit.name;
      }
    }
    return { best, name };
  }, [habits, state, today]);

  const weekRatio = useMemo(() => {
    const start = startOfWeek(today);
    return sumRatios(
      habits.map((habit) => ratioInRange(checkSet(state, habit.id), start, today, habit.createdAt, today)),
    );
  }, [habits, state, today]);

  function commit(recipe: (current: HabitState) => HabitState) {
    setState((current) => (current ? recipe(current) : current));
  }

  function openAdd() {
    setDraft({ mode: "add" });
  }

  function changeView(next: View) {
    setView(next);
    if (next === "month") {
      setSelectedDay(monthKey(cursor) === monthKey(today) ? today : null);
    }
  }

  const floor = addDays(today, -400);
  const canPrev =
    view === "week"
      ? addDays(startOfWeek(cursor), -7) >= startOfWeek(floor)
      : monthKey(addMonths(cursor, -1)) >= monthKey(floor);
  const canNext = view === "week" ? startOfWeek(cursor) < startOfWeek(today) : monthKey(cursor) < monthKey(today);
  const onToday = view === "week" ? startOfWeek(cursor) === startOfWeek(today) : monthKey(cursor) === monthKey(today);

  function shift(direction: -1 | 1) {
    setCursor((current) =>
      view === "week" ? addDays(startOfWeek(current), direction * 7) : addMonths(current, direction),
    );
    if (view === "month") setSelectedDay(null);
  }

  const atLimit = habits.length >= MAX_HABITS;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl leading-none font-medium tracking-tight text-ink">Rite</h1>
          <p className="mt-2 text-sm text-muted">{formatLong(today)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ViewToggle view={view} onChange={changeView} />
          <button
            type="button"
            onClick={openAdd}
            disabled={atLimit}
            title={atLimit ? "Twelve habits is the limit for a board you can still scan" : undefined}
            className="pressable inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" />
            Add habit
          </button>
        </div>
      </header>

      {habits.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          <section aria-label="Summary" className="grid grid-cols-3 gap-2 sm:gap-3">
            <Stat
              label="Today"
              value={progress.total === 0 ? "—" : `${progress.done}/${progress.total}`}
              caption={
                progress.total === 0
                  ? "Nothing scheduled"
                  : progress.done === progress.total
                    ? "All kept"
                    : `${progress.total - progress.done} still open`
              }
            />
            <Stat
              label="Live streak"
              value={liveStreak.best === 0 ? "0" : String(liveStreak.best)}
              caption={liveStreak.best === 0 ? "Check in today" : liveStreak.name}
            />
            <Stat
              label="This week"
              value={weekRatio.total === 0 ? "—" : `${percent(weekRatio)}%`}
              caption={weekRatio.total === 0 ? "Starts when you do" : `${weekRatio.done} of ${weekRatio.total}`}
            />
          </section>

          <div className="grid items-start gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-medium text-ink">Check off</h2>
              <p className="text-sm text-muted tabular-nums">
                {progress.done} of {progress.total}
              </p>
            </div>
            <ul className="mt-3 overflow-hidden rounded-xl border border-line bg-card">
              {habits.map((habit, index) => {
                const dates = checkSet(state, habit.id);
                const stats = habitStats(habit, dates, today);
                const on = stats.todayDone;
                return (
                  <li
                    key={habit.id}
                    className={cn(
                      "flex items-center gap-1 pr-1",
                      index > 0 && "border-t border-line",
                      activeFocus === habit.id && "bg-paper",
                    )}
                  >
                    <Mark
                      on={on}
                      color={habit.color}
                      todayMark
                      label={
                        on
                          ? `Clear ${habit.name} for today`
                          : `Mark ${habit.name} done for today`
                      }
                      onToggle={() => commit((current) => toggleCheck(current, habit.id, today, today))}
                    />
                    <button
                      type="button"
                      aria-pressed={activeFocus === habit.id}
                      onClick={() => setFocus((current) => (current === habit.id ? "all" : habit.id))}
                      className="min-w-0 flex-1 py-2 text-left"
                    >
                      <span className="block truncate text-sm font-medium text-ink">{habit.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {streakCaption(stats.current, stats.todayDone)}
                      </span>
                    </button>
                    <HabitMenu
                      habit={habit}
                      onEdit={() => setDraft({ mode: "edit", habit })}
                      onDelete={() => setPendingDelete(habit)}
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          <CalendarCard
            state={state}
            today={today}
            view={view}
            cursor={cursor}
            focus={activeFocus}
            shown={shown}
            habits={habits}
            selectedDay={selectedDay}
            canPrev={canPrev}
            canNext={canNext}
            onToday={onToday}
            onShift={shift}
            onJumpToday={() => {
              setCursor(today);
              if (view === "month") setSelectedDay(today);
            }}
            onFocus={setFocus}
            onSelectDay={setSelectedDay}
            onToggle={(habitId, iso) => commit((current) => toggleCheck(current, habitId, iso, today))}
          />
          </div>

          <Record
            state={state}
            today={today}
            onEdit={(habit) => setDraft({ mode: "edit", habit })}
            onDelete={setPendingDelete}
          />

          <p className="text-xs text-faint">Saved in this browser. Sample habits can be removed anytime.</p>
        </div>
      )}

      <HabitDialog
        open={draft !== null}
        mode={draft?.mode ?? "add"}
        initialName={draft?.mode === "edit" ? draft.habit.name : ""}
        initialColor={draft?.mode === "edit" ? draft.habit.color : nextColor(habits)}
        onClose={() => setDraft(null)}
        onSubmit={(name, color) => {
          if (draft?.mode === "edit") {
            commit((current) => updateHabit(current, draft.habit.id, { name, color }));
          } else {
            commit((current) => addHabit(current, name, color, today));
          }
          setDraft(null);
        }}
      />
      <ConfirmRemove
        habit={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          const id = pendingDelete.id;
          commit((current) => deleteHabit(current, id));
          if (focus === id) setFocus("all");
          setPendingDelete(null);
        }}
      />
    </main>
  );
}

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <article className="min-w-0 rounded-lg border border-line bg-card px-3 py-3 sm:px-4">
      <p className="truncate text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 truncate font-display text-2xl leading-none font-medium text-ink tabular-nums sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-muted">{caption}</p>
    </article>
  );
}

function ViewToggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <div className="flex rounded-full bg-paper-deep p-1" role="tablist" aria-label="Calendar view">
      {(["week", "month"] as const).map((option) => {
        const selected = view === option;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option)}
            className={cn(
              "pressable h-11 rounded-full px-4 text-sm font-medium capitalize",
              selected ? "bg-ink text-paper" : "text-muted hover:text-ink",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <section className="mt-8 rounded-xl border border-line bg-card px-5 py-10 text-center">
      <h2 className="font-display text-3xl font-medium text-ink">Nothing kept yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Add a habit you can finish in a day. Check it off when it is done, and the calendar will start to fill.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="pressable mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper"
      >
        <Plus className="size-4" />
        Add habit
      </button>
    </section>
  );
}

function Mark({
  on,
  color,
  label,
  todayMark,
  disabled,
  onToggle,
}: {
  on: boolean;
  color: HabitColor;
  label: string;
  todayMark?: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const ui = COLOR_UI[color];
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={on}
      aria-label={label}
      onClick={onToggle}
      className="pressable flex size-11 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed"
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full",
          on && ui.fill,
          !on && !disabled && cn("bg-card ring-inset", todayMark ? "ring-2" : "ring-1", ui.ring),
        )}
      >
        {on ? <Check className="size-4" strokeWidth={2.5} /> : null}
      </span>
    </button>
  );
}

function HabitMenu({
  habit,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Actions for ${habit.name}`}
          className="pressable flex size-11 items-center justify-center rounded-sm text-muted hover:bg-paper-deep hover:text-ink"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="menu-panel z-50 min-w-40 rounded-lg border border-line bg-card p-2"
        >
          <DropdownMenu.Item
            onSelect={onEdit}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-ink outline-none data-[highlighted]:bg-paper-deep"
          >
            <Pencil className="size-4" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={onDelete}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-danger outline-none data-[highlighted]:bg-paper-deep"
          >
            <Trash2 className="size-4" />
            Remove
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function CalendarCard({
  state,
  today,
  view,
  cursor,
  focus,
  shown,
  habits,
  selectedDay,
  canPrev,
  canNext,
  onToday,
  onShift,
  onJumpToday,
  onFocus,
  onSelectDay,
  onToggle,
}: {
  state: HabitState;
  today: string;
  view: View;
  cursor: string;
  focus: Focus;
  shown: Habit[];
  habits: Habit[];
  selectedDay: string | null;
  canPrev: boolean;
  canNext: boolean;
  onToday: boolean;
  onShift: (direction: -1 | 1) => void;
  onJumpToday: () => void;
  onFocus: (focus: Focus) => void;
  onSelectDay: (iso: string) => void;
  onToggle: (habitId: string, iso: string) => void;
}) {
  const periodStart = view === "week" ? startOfWeek(cursor) : `${monthKey(cursor)}-01`;
  const periodEnd =
    view === "week" ? addDays(periodStart, 6) : addDays(addMonths(`${monthKey(cursor)}-01`, 1), -1);
  const periodRatio = sumRatios(
    shown.map((habit) =>
      ratioInRange(checkSet(state, habit.id), periodStart, periodEnd, habit.createdAt, today),
    ),
  );
  const label = view === "week" ? formatWeekSpan(startOfWeek(cursor)) : formatMonth(cursor);

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex flex-col gap-3 border-b border-line px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-medium text-ink">{view === "week" ? "This week" : "This month"}</h2>
          <p className="text-sm text-muted tabular-nums">
            {periodRatio.total === 0 ? "No days in range yet" : `${periodRatio.done} of ${periodRatio.total} kept`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!onToday ? (
            <button
              type="button"
              onClick={onJumpToday}
              className="pressable h-11 rounded-sm px-3 text-sm font-medium text-ink hover:bg-paper-deep"
            >
              Today
            </button>
          ) : null}
          <button
            type="button"
            aria-label={view === "week" ? "Previous week" : "Previous month"}
            disabled={!canPrev}
            onClick={() => onShift(-1)}
            className="pressable flex size-11 items-center justify-center rounded-sm text-ink hover:bg-paper-deep disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="min-w-28 text-center text-sm font-medium text-ink tabular-nums">{label}</p>
          <button
            type="button"
            aria-label={view === "week" ? "Next week" : "Next month"}
            disabled={!canNext}
            onClick={() => onShift(1)}
            className="pressable flex size-11 items-center justify-center rounded-sm text-ink hover:bg-paper-deep disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="scroll-thin flex gap-2 overflow-x-auto px-3 py-3 sm:px-4">
        <FilterChip active={focus === "all"} onClick={() => onFocus("all")}>
          All
        </FilterChip>
        {habits.map((habit) => (
          <FilterChip key={habit.id} active={focus === habit.id} onClick={() => onFocus(habit.id)}>
            <span className={cn("size-2 shrink-0 rounded-full", COLOR_UI[habit.color].dot)} />
            <span className="truncate">{habit.name}</span>
          </FilterChip>
        ))}
      </div>

      {view === "week" ? (
        <WeekBoard state={state} today={today} cursor={cursor} shown={shown} onToggle={onToggle} />
      ) : (
        <MonthBoard
          state={state}
          today={today}
          cursor={cursor}
          shown={shown}
          focus={focus}
          selectedDay={selectedDay}
          onSelectDay={onSelectDay}
          onToggle={onToggle}
        />
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "pressable inline-flex h-11 max-w-52 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-medium",
        active ? "bg-ink text-paper" : "border border-line bg-card text-ink hover:bg-paper-deep",
      )}
    >
      {children}
    </button>
  );
}

function WeekBoard({
  state,
  today,
  cursor,
  shown,
  onToggle,
}: {
  state: HabitState;
  today: string;
  cursor: string;
  shown: Habit[];
  onToggle: (habitId: string, iso: string) => void;
}) {
  const days = weekDates(cursor);
  return (
    <>
      <div className="border-t border-line lg:hidden">
        <div className="grid grid-cols-7 border-b border-line">
          {days.map((iso, index) => (
            <DayHeading key={iso} iso={iso} today={today} weekend={index >= 5} />
          ))}
        </div>
        {shown.map((habit) => (
          <div key={habit.id} className="border-b border-line px-1 py-1 last:border-b-0">
            <p className="truncate px-2 pt-1 text-sm font-medium text-ink">{habit.name}</p>
            <div className="grid grid-cols-7">
              {days.map((iso) => (
                <DayCell
                  key={iso}
                  habit={habit}
                  iso={iso}
                  dates={checkSet(state, habit.id)}
                  today={today}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="week-scroll scroll-thin hidden border-t border-line lg:block">
        <div className="week-grid">
          <div className="week-sticky border-r border-b border-line px-3 py-2 text-xs font-medium tracking-wide text-muted uppercase">
            Habit
          </div>
          {days.map((iso, index) => (
            <div key={iso} className={cn("border-b border-line", iso === today && "bg-paper")}>
              <DayHeading iso={iso} today={today} weekend={index >= 5} />
            </div>
          ))}
          {shown.map((habit) => (
            <WeekRow key={habit.id} habit={habit} days={days} dates={checkSet(state, habit.id)} today={today} onToggle={onToggle} />
          ))}
        </div>
      </div>
    </>
  );
}

function DayHeading({ iso, today, weekend }: { iso: string; today: string; weekend: boolean }) {
  const isToday = iso === today;
  return (
    <div className={cn("px-1 py-2 text-center", isToday && "bg-paper")}>
      <p className={cn("text-xs font-medium", weekend && !isToday ? "text-faint" : "text-muted")}>{formatWeekday(iso)}</p>
      <p className={cn("text-sm tabular-nums", isToday ? "font-semibold text-ink" : "text-muted")}>{dayNumber(iso)}</p>
      <span className={cn("mx-auto mt-1 block h-0.5 w-3 rounded-full", isToday ? "bg-ink" : "bg-transparent")} />
    </div>
  );
}

function WeekRow({
  habit,
  days,
  dates,
  today,
  onToggle,
}: {
  habit: Habit;
  days: string[];
  dates: Set<string>;
  today: string;
  onToggle: (habitId: string, iso: string) => void;
}) {
  return (
    <>
      <div className="week-sticky flex min-w-0 items-center overflow-hidden border-r border-b border-line px-3">
        <p className="truncate text-sm font-medium text-ink">{habit.name}</p>
      </div>
      {days.map((iso) => (
        <div key={iso} className={cn("border-b border-line", iso === today && "bg-paper")}>
          <DayCell habit={habit} iso={iso} dates={dates} today={today} onToggle={onToggle} />
        </div>
      ))}
    </>
  );
}

function DayCell({
  habit,
  iso,
  dates,
  today,
  onToggle,
}: {
  habit: Habit;
  iso: string;
  dates: Set<string>;
  today: string;
  onToggle: (habitId: string, iso: string) => void;
}) {
  const on = dates.has(iso);
  const allowed = canToggle(habit, iso, today);
  const prevOn = dates.has(addDays(iso, -1));
  const nextOn = dates.has(addDays(iso, 1)) && addDays(iso, 1) <= today;
  const isToday = iso === today;
  const ui = COLOR_UI[habit.color];
  return (
    <button
      type="button"
      disabled={!allowed}
      aria-pressed={on}
      aria-label={
        allowed
          ? `${on ? "Clear" : "Mark"} ${habit.name} for ${formatLong(iso)}`
          : `${habit.name} is not tracked on ${formatLong(iso)}`
      }
      onClick={() => onToggle(habit.id, iso)}
      className="pressable relative flex h-11 w-full items-center justify-center disabled:cursor-default"
    >
      {on && prevOn ? <span className={cn("absolute top-1/2 left-0 h-2 w-1/2 -translate-y-1/2", ui.track)} /> : null}
      {on && nextOn ? <span className={cn("absolute top-1/2 right-0 h-2 w-1/2 -translate-y-1/2", ui.track)} /> : null}
      <span
        className={cn(
          "relative z-10 flex size-8 items-center justify-center rounded-full",
          on && ui.fill,
          !on && allowed && cn("bg-card ring-1 ring-inset", isToday && "ring-2", ui.ring),
        )}
      >
        {on ? <Check className="size-4" strokeWidth={2.5} /> : null}
      </span>
    </button>
  );
}

function MonthBoard({
  state,
  today,
  cursor,
  shown,
  focus,
  selectedDay,
  onSelectDay,
  onToggle,
}: {
  state: HabitState;
  today: string;
  cursor: string;
  shown: Habit[];
  focus: Focus;
  selectedDay: string | null;
  onSelectDay: (iso: string) => void;
  onToggle: (habitId: string, iso: string) => void;
}) {
  const cells = monthGrid(cursor);
  const weekdays = weekDates(cursor);
  const single = focus !== "all" ? shown[0] : undefined;
  const activeDay =
    selectedDay && monthKey(selectedDay) === monthKey(cursor) && focus === "all" ? selectedDay : null;

  return (
    <div className="border-t border-line px-2 py-3 sm:px-3">
      <div className="grid grid-cols-7">
        {weekdays.map((iso, index) => (
          <p
            key={iso}
            className={cn(
              "pb-2 text-center text-xs font-medium",
              index >= 5 ? "text-faint" : "text-muted",
            )}
          >
            {formatWeekday(iso)}
          </p>
        ))}
        {cells.map((cell) => {
          if (!cell.inMonth) {
            return <div key={cell.iso} aria-hidden className="min-h-16" />;
          }
          return (
            <MonthCell
              key={cell.iso}
              iso={cell.iso}
              today={today}
              state={state}
              shown={shown}
              single={single}
              selected={activeDay === cell.iso}
              onSelectDay={onSelectDay}
              onToggle={onToggle}
            />
          );
        })}
      </div>
      {activeDay ? (
        <DayPanel iso={activeDay} today={today} state={state} habits={shown} onToggle={onToggle} />
      ) : focus === "all" ? (
        <p className="px-2 pt-3 text-sm text-muted">Select a day to check habits on or off.</p>
      ) : null}
    </div>
  );
}

function MonthCell({
  iso,
  today,
  state,
  shown,
  single,
  selected,
  onSelectDay,
  onToggle,
}: {
  iso: string;
  today: string;
  state: HabitState;
  shown: Habit[];
  single?: Habit;
  selected: boolean;
  onSelectDay: (iso: string) => void;
  onToggle: (habitId: string, iso: string) => void;
}) {
  const future = iso > today;
  const eligible = shown.filter((habit) => habit.createdAt <= iso && iso <= today);
  const done = eligible.filter((habit) => isChecked(state, habit.id, iso));
  const full = eligible.length > 0 && done.length === eligible.length;
  const isToday = iso === today;
  const numberClass = cn(
    "flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
    full && "bg-ink text-paper",
    isToday && !full && "ring-1 ring-ink text-ink",
    !full && !isToday && done.length === 0 && "text-faint",
    !full && !isToday && done.length > 0 && "text-ink",
  );

  if (single) {
    const allowed = canToggle(single, iso, today);
    const on = isChecked(state, single.id, iso);
    const ui = COLOR_UI[single.color];
    return (
      <button
        type="button"
        disabled={!allowed}
        aria-pressed={on}
        aria-current={isToday ? "date" : undefined}
        aria-label={
          allowed
            ? `${on ? "Clear" : "Mark"} ${single.name} for ${formatLong(iso)}`
            : `${formatLong(iso)} is outside ${single.name}`
        }
        onClick={() => onToggle(single.id, iso)}
        className="pressable flex min-h-20 flex-col items-center justify-center gap-1 rounded-sm disabled:cursor-default"
      >
        <span className={numberClass}>{dayNumber(iso)}</span>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            on && ui.fill,
            !on && allowed && cn("ring-1 ring-inset", isToday && "ring-2", ui.ring),
            future && "opacity-40",
          )}
        >
          {on ? <Check className="size-4" strokeWidth={2.5} /> : null}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-current={isToday ? "date" : undefined}
      aria-label={`${formatLong(iso)}, ${done.length} of ${eligible.length} kept`}
      onClick={() => onSelectDay(iso)}
      className={cn(
        "pressable flex min-h-20 flex-col items-center gap-1 rounded-sm px-0.5 py-1",
        selected && "bg-paper-deep",
      )}
    >
      <span className={numberClass}>{dayNumber(iso)}</span>
      <span className="flex min-h-4 max-w-full flex-wrap justify-center gap-0.5">
        {done.map((habit) => (
          <span key={habit.id} className={cn("size-2 rounded-full", COLOR_UI[habit.color].dot)} />
        ))}
      </span>
    </button>
  );
}

function DayPanel({
  iso,
  today,
  state,
  habits,
  onToggle,
}: {
  iso: string;
  today: string;
  state: HabitState;
  habits: Habit[];
  onToggle: (habitId: string, iso: string) => void;
}) {
  const future = iso > today;
  return (
    <div className="mt-3 border-t border-line px-2 pt-3">
      <h3 className="font-display text-lg font-medium text-ink">{formatLong(iso)}</h3>
      {future ? <p className="mt-1 text-sm text-muted">This day has not arrived.</p> : null}
      <ul className="mt-2">
        {habits.map((habit) => {
          const allowed = canToggle(habit, iso, today);
          const on = isChecked(state, habit.id, iso);
          return (
            <li key={habit.id} className="flex items-center justify-between gap-3 border-b border-line last:border-b-0">
              <span className="flex min-w-0 items-center gap-2 text-sm text-ink">
                <span className={cn("size-2 shrink-0 rounded-full", COLOR_UI[habit.color].dot)} />
                <span className="truncate">{habit.name}</span>
              </span>
              {allowed ? (
                <Mark
                  on={on}
                  color={habit.color}
                  todayMark={iso === today}
                  label={`${on ? "Clear" : "Mark"} ${habit.name} for ${formatLong(iso)}`}
                  onToggle={() => onToggle(habit.id, iso)}
                />
              ) : (
                <span className="pr-3 text-xs text-faint">{future ? "Ahead" : "Not started"}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Record({
  state,
  today,
  onEdit,
  onDelete,
}: {
  state: HabitState;
  today: string;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-medium text-ink">Record</h2>
      <p className="mt-1 text-sm text-muted">Streaks count through yesterday until you check off today.</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {state.habits.map((habit) => {
          const stats = habitStats(habit, checkSet(state, habit.id), today);
          return (
            <li key={habit.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-2">
                    <span className={cn("size-2.5 shrink-0 rounded-full", COLOR_UI[habit.color].dot)} />
                    <span className="truncate text-sm font-medium text-ink">{habit.name}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">{streakCaption(stats.current, stats.todayDone)}</p>
                </div>
                <HabitMenu habit={habit} onEdit={() => onEdit(habit)} onDelete={() => onDelete(habit)} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                <Metric label="Streak" value={String(stats.current)} />
                <Metric label="Best" value={String(stats.longest)} />
                <Metric label="7 days" value={formatRatio(stats.week)} />
                <Metric label="30 days" value={formatRatio(stats.month)} />
                <div className="col-span-2 flex items-baseline justify-between gap-3 border-t border-line pt-3">
                  <dt className="text-xs text-muted">Since start</dt>
                  <dd className="text-sm font-medium text-ink tabular-nums">
                    {stats.since.total === 0 ? "—" : `${percent(stats.since)}% · ${formatRatio(stats.since)}`}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-display text-xl leading-none font-medium text-ink tabular-nums">{value}</dd>
    </div>
  );
}

function formatRatio(ratio: Ratio): string {
  if (ratio.total === 0) return "—";
  return `${ratio.done}/${ratio.total}`;
}
