export const HABIT_COLORS = ["pine", "sea", "clay", "slate", "stone", "rose"] as const;

export type HabitColor = (typeof HABIT_COLORS)[number];

export type Habit = {
  id: string;
  name: string;
  color: HabitColor;
  createdAt: string;
};

export type HabitState = {
  habits: Habit[];
  checks: Record<string, string[]>;
};

export type Ratio = { done: number; total: number };

export const MAX_HABITS = 12;
export const MAX_NAME = 40;
const STORAGE_KEY = "rite.habits.v1";
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const COLOR_SET = new Set<string>(HABIT_COLORS);

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(now = new Date()): string {
  return toISO(now);
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(iso: string, days: number): string {
  const date = parseISO(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function startOfWeek(iso: string): string {
  const day = parseISO(iso).getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(iso, diff);
}

export function weekDates(anchor: string): string[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function monthGrid(anchor: string): { iso: string; inMonth: boolean }[] {
  const [yearText, monthText] = monthKey(anchor).split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const first = `${monthKey(anchor)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const last = `${monthKey(anchor)}-${String(lastDay).padStart(2, "0")}`;
  const start = startOfWeek(first);
  const endDow = parseISO(last).getDay();
  const end = addDays(last, endDow === 0 ? 0 : 7 - endDow);
  const cells: { iso: string; inMonth: boolean }[] = [];
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    cells.push({ iso: cursor, inMonth: monthKey(cursor) === monthKey(anchor) });
  }
  return cells;
}

export function formatLong(iso: string): string {
  return parseISO(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatMonth(iso: string): string {
  return parseISO(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function addMonths(iso: string, count: number): string {
  const date = parseISO(iso);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + count);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, last));
  return toISO(date);
}

export function formatWeekSpan(start: string): string {
  const end = addDays(start, 6);
  const a = parseISO(start);
  const b = parseISO(end);
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    const month = a.toLocaleDateString("en-US", { month: "short" });
    return `${month} ${a.getDate()} – ${b.getDate()}`;
  }
  const left = a.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const right = b.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${left} – ${right}`;
}

export function formatWeekday(iso: string): string {
  return parseISO(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export function dayNumber(iso: string): number {
  return Number(iso.slice(8));
}

export function completion(dates: Set<string>, from: string, to: string): Ratio {
  if (to < from) return { done: 0, total: 0 };
  let done = 0;
  let total = 0;
  for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) {
    total += 1;
    if (dates.has(cursor)) done += 1;
  }
  return { done, total };
}

export function currentStreak(dates: Set<string>, today: string, from: string): number {
  if (today < from) return 0;
  let cursor = dates.has(today) ? today : addDays(today, -1);
  if (cursor < from) return 0;
  let count = 0;
  while (cursor >= from && dates.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function longestStreak(dates: Set<string>, from: string, to: string): number {
  if (to < from) return 0;
  let best = 0;
  let run = 0;
  for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) {
    if (dates.has(cursor)) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return best;
}

export function checkSet(state: HabitState, id: string): Set<string> {
  return new Set(state.checks[id] ?? []);
}

export function isChecked(state: HabitState, id: string, iso: string): boolean {
  return (state.checks[id] ?? []).includes(iso);
}

export function canToggle(habit: Habit, iso: string, today: string): boolean {
  return iso >= habit.createdAt && iso <= today;
}

export type HabitStats = {
  current: number;
  todayDone: boolean;
  longest: number;
  week: Ratio;
  month: Ratio;
  since: Ratio;
};

export function habitStats(habit: Habit, dates: Set<string>, today: string): HabitStats {
  const from = habit.createdAt;
  const window = (start: string) => completion(dates, start > from ? start : from, today);
  return {
    current: currentStreak(dates, today, from),
    todayDone: dates.has(today),
    longest: longestStreak(dates, from, today),
    week: window(addDays(today, -6)),
    month: window(addDays(today, -29)),
    since: window(from),
  };
}

export function ratioInRange(
  dates: Set<string>,
  from: string,
  to: string,
  habitStart: string,
  today: string,
): Ratio {
  const start = from > habitStart ? from : habitStart;
  const end = to < today ? to : today;
  return completion(dates, start, end);
}

export function percent(ratio: Ratio): number {
  if (ratio.total === 0) return 0;
  return Math.round((ratio.done / ratio.total) * 100);
}

export function sumRatios(ratios: Ratio[]): Ratio {
  return ratios.reduce((acc, ratio) => ({ done: acc.done + ratio.done, total: acc.total + ratio.total }), {
    done: 0,
    total: 0,
  });
}

export function nextColor(habits: Habit[]): HabitColor {
  const used = new Set(habits.map((habit) => habit.color));
  return HABIT_COLORS.find((color) => !used.has(color)) ?? "pine";
}

export function toggleCheck(state: HabitState, habitId: string, iso: string, today: string): HabitState {
  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit || !canToggle(habit, iso, today)) return state;
  const current = new Set(state.checks[habitId] ?? []);
  if (current.has(iso)) current.delete(iso);
  else current.add(iso);
  return {
    ...state,
    checks: { ...state.checks, [habitId]: [...current].sort() },
  };
}

export function addHabit(state: HabitState, name: string, color: HabitColor, today: string): HabitState {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed.length > MAX_NAME || state.habits.length >= MAX_HABITS) return state;
  const habit: Habit = {
    id: crypto.randomUUID(),
    name: trimmed,
    color,
    createdAt: today,
  };
  return {
    habits: [...state.habits, habit],
    checks: { ...state.checks, [habit.id]: [] },
  };
}

export function updateHabit(
  state: HabitState,
  id: string,
  patch: { name?: string; color?: HabitColor },
): HabitState {
  const name = patch.name?.trim().replace(/\s+/g, " ");
  if (name !== undefined && (!name || name.length > MAX_NAME)) return state;
  return {
    ...state,
    habits: state.habits.map((habit) =>
      habit.id === id
        ? {
            ...habit,
            name: name ?? habit.name,
            color: patch.color ?? habit.color,
          }
        : habit,
    ),
  };
}

export function deleteHabit(state: HabitState, id: string): HabitState {
  const checks = { ...state.checks };
  delete checks[id];
  return { habits: state.habits.filter((habit) => habit.id !== id), checks };
}

function hash(seed: number, iso: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < iso.length; i += 1) {
    h = (Math.imul(h, 33) + iso.charCodeAt(i)) >>> 0;
  }
  return h % 100;
}

function fillRange(dates: Set<string>, from: string, to: string) {
  for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) dates.add(cursor);
}

type SeedSpec = {
  id: string;
  name: string;
  color: HabitColor;
  startDaysAgo: number;
  rate: number;
  streak: number;
  todayOn: boolean;
  pastRun?: { endDaysAgo: number; length: number };
};

const SEED: SeedSpec[] = [
  {
    id: "h-pages",
    name: "Morning pages",
    color: "pine",
    startDaysAgo: 42,
    rate: 74,
    streak: 11,
    todayOn: false,
  },
  {
    id: "h-walk",
    name: "Walk outside",
    color: "sea",
    startDaysAgo: 28,
    rate: 70,
    streak: 6,
    todayOn: true,
  },
  {
    id: "h-read",
    name: "Read twenty pages",
    color: "clay",
    startDaysAgo: 50,
    rate: 60,
    streak: 0,
    todayOn: false,
    pastRun: { endDaysAgo: 16, length: 8 },
  },
  {
    id: "h-lights",
    name: "Lights out by eleven",
    color: "slate",
    startDaysAgo: 18,
    rate: 66,
    streak: 4,
    todayOn: false,
  },
];

export function createSeed(today = todayISO()): HabitState {
  const habits: Habit[] = [];
  const checks: Record<string, string[]> = {};
  SEED.forEach((spec, index) => {
    const createdAt = addDays(today, -spec.startDaysAgo);
    habits.push({ id: spec.id, name: spec.name, color: spec.color, createdAt });
    const dates = new Set<string>();
    for (let cursor = createdAt; cursor <= today; cursor = addDays(cursor, 1)) {
      if (hash((index + 1) * 97, cursor) < spec.rate) dates.add(cursor);
    }
    if (spec.pastRun) {
      const end = addDays(today, -spec.pastRun.endDaysAgo);
      const begin = addDays(end, -(spec.pastRun.length - 1));
      dates.delete(addDays(begin, -1));
      dates.delete(addDays(end, 1));
      fillRange(dates, begin, end);
    }
    if (spec.streak > 0) {
      const end = spec.todayOn ? today : addDays(today, -1);
      const begin = addDays(end, -(spec.streak - 1));
      dates.delete(addDays(begin, -1));
      if (!spec.todayOn) dates.delete(today);
      fillRange(dates, begin, end);
    } else {
      dates.delete(today);
      dates.delete(addDays(today, -1));
    }
    checks[spec.id] = [...dates].sort();
  });
  return { habits, checks };
}

export function parseState(raw: string): HabitState | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const record = data as { habits?: unknown; checks?: unknown };
  if (!Array.isArray(record.habits) || !record.checks || typeof record.checks !== "object") return null;
  const habits: Habit[] = [];
  for (const item of record.habits) {
    if (!item || typeof item !== "object") return null;
    const habit = item as Record<string, unknown>;
    if (typeof habit.id !== "string" || !habit.id) return null;
    if (typeof habit.name !== "string") return null;
    if (typeof habit.color !== "string" || !COLOR_SET.has(habit.color)) return null;
    if (typeof habit.createdAt !== "string" || !ISO.test(habit.createdAt)) return null;
    const name = habit.name.trim().replace(/\s+/g, " ");
    if (!name || name.length > MAX_NAME) return null;
    habits.push({
      id: habit.id,
      name,
      color: habit.color as HabitColor,
      createdAt: habit.createdAt,
    });
  }
  if (habits.length > MAX_HABITS) return null;
  const ids = new Set(habits.map((habit) => habit.id));
  const checks: Record<string, string[]> = {};
  for (const [id, dates] of Object.entries(record.checks as Record<string, unknown>)) {
    if (!ids.has(id) || !Array.isArray(dates)) continue;
    const clean = [
      ...new Set(dates.filter((date): date is string => typeof date === "string" && ISO.test(date))),
    ].sort();
    checks[id] = clean;
  }
  for (const id of ids) if (!checks[id]) checks[id] = [];
  return { habits, checks };
}

export function loadState(): HabitState {
  if (typeof window === "undefined") return createSeed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeed();
    return parseState(raw) ?? createSeed();
  } catch {
    return createSeed();
  }
}

export function saveState(state: HabitState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode or a full disk — keep the in-memory board */
  }
}

export function streakCaption(streak: number, todayDone: boolean): string {
  if (streak <= 0) return "No streak yet";
  const label = streak === 1 ? "1 day" : `${streak} days`;
  return todayDone ? label : `${label} · open today`;
}
