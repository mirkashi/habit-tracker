import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime, a as AlertDialogDescription, c as AlertDialogTitle, d as DialogContent, f as DialogDescription, h as DialogTitle, i as AlertDialogContent, l as Dialog, m as DialogPortal, n as AlertDialogAction, o as AlertDialogOverlay, p as DialogOverlay, r as AlertDialogCancel, s as AlertDialogPortal, t as AlertDialog, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Pencil, c as ChevronLeft, i as Plus, l as Check, o as Ellipsis, r as Trash2, s as ChevronRight, t as X } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuPortal, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-aAbH-gQl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLOR_LABEL = {
	pine: "Pine",
	sea: "Sea",
	clay: "Clay",
	slate: "Slate",
	stone: "Stone",
	rose: "Rose"
};
var COLOR_UI = {
	pine: {
		fill: "bg-habit-pine text-paper",
		ink: "text-habit-pine",
		dot: "bg-habit-pine",
		track: "bg-habit-pine/35",
		ring: "ring-habit-pine/55"
	},
	sea: {
		fill: "bg-habit-sea text-paper",
		ink: "text-habit-sea",
		dot: "bg-habit-sea",
		track: "bg-habit-sea/35",
		ring: "ring-habit-sea/55"
	},
	clay: {
		fill: "bg-habit-clay text-paper",
		ink: "text-habit-clay",
		dot: "bg-habit-clay",
		track: "bg-habit-clay/35",
		ring: "ring-habit-clay/55"
	},
	slate: {
		fill: "bg-habit-slate text-paper",
		ink: "text-habit-slate",
		dot: "bg-habit-slate",
		track: "bg-habit-slate/35",
		ring: "ring-habit-slate/55"
	},
	stone: {
		fill: "bg-habit-stone text-paper",
		ink: "text-habit-stone",
		dot: "bg-habit-stone",
		track: "bg-habit-stone/40",
		ring: "ring-habit-stone/60"
	},
	rose: {
		fill: "bg-habit-rose text-paper",
		ink: "text-habit-rose",
		dot: "bg-habit-rose",
		track: "bg-habit-rose/35",
		ring: "ring-habit-rose/55"
	}
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var HABIT_COLORS = [
	"pine",
	"sea",
	"clay",
	"slate",
	"stone",
	"rose"
];
var STORAGE_KEY = "rite.habits.v1";
var ISO = /^\d{4}-\d{2}-\d{2}$/;
var COLOR_SET = new Set(HABIT_COLORS);
function toISO(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function todayISO(now = /* @__PURE__ */ new Date()) {
	return toISO(now);
}
function parseISO(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function addDays(iso, days) {
	const date = parseISO(iso);
	date.setDate(date.getDate() + days);
	return toISO(date);
}
function startOfWeek(iso) {
	const day = parseISO(iso).getDay();
	return addDays(iso, day === 0 ? -6 : 1 - day);
}
function weekDates(anchor) {
	const start = startOfWeek(anchor);
	return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
function monthKey(iso) {
	return iso.slice(0, 7);
}
function monthGrid(anchor) {
	const [yearText, monthText] = monthKey(anchor).split("-");
	const year = Number(yearText);
	const month = Number(monthText);
	const first = `${monthKey(anchor)}-01`;
	const lastDay = new Date(year, month, 0).getDate();
	const last = `${monthKey(anchor)}-${String(lastDay).padStart(2, "0")}`;
	const start = startOfWeek(first);
	const endDow = parseISO(last).getDay();
	const end = addDays(last, endDow === 0 ? 0 : 7 - endDow);
	const cells = [];
	for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) cells.push({
		iso: cursor,
		inMonth: monthKey(cursor) === monthKey(anchor)
	});
	return cells;
}
function formatLong(iso) {
	return parseISO(iso).toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric"
	});
}
function formatMonth(iso) {
	return parseISO(iso).toLocaleDateString("en-US", {
		month: "long",
		year: "numeric"
	});
}
function addMonths(iso, count) {
	const date = parseISO(iso);
	const day = date.getDate();
	date.setDate(1);
	date.setMonth(date.getMonth() + count);
	const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	date.setDate(Math.min(day, last));
	return toISO(date);
}
function formatWeekSpan(start) {
	const end = addDays(start, 6);
	const a = parseISO(start);
	const b = parseISO(end);
	if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) return `${a.toLocaleDateString("en-US", { month: "short" })} ${a.getDate()} – ${b.getDate()}`;
	return `${a.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	})} – ${b.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	})}`;
}
function formatWeekday(iso) {
	return parseISO(iso).toLocaleDateString("en-US", { weekday: "short" });
}
function dayNumber(iso) {
	return Number(iso.slice(8));
}
function completion(dates, from, to) {
	if (to < from) return {
		done: 0,
		total: 0
	};
	let done = 0;
	let total = 0;
	for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) {
		total += 1;
		if (dates.has(cursor)) done += 1;
	}
	return {
		done,
		total
	};
}
function currentStreak(dates, today, from) {
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
function longestStreak(dates, from, to) {
	if (to < from) return 0;
	let best = 0;
	let run = 0;
	for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) if (dates.has(cursor)) {
		run += 1;
		if (run > best) best = run;
	} else run = 0;
	return best;
}
function checkSet(state, id) {
	return new Set(state.checks[id] ?? []);
}
function isChecked(state, id, iso) {
	return (state.checks[id] ?? []).includes(iso);
}
function canToggle(habit, iso, today) {
	return iso >= habit.createdAt && iso <= today;
}
function habitStats(habit, dates, today) {
	const from = habit.createdAt;
	const window = (start) => completion(dates, start > from ? start : from, today);
	return {
		current: currentStreak(dates, today, from),
		todayDone: dates.has(today),
		longest: longestStreak(dates, from, today),
		week: window(addDays(today, -6)),
		month: window(addDays(today, -29)),
		since: window(from)
	};
}
function ratioInRange(dates, from, to, habitStart, today) {
	return completion(dates, from > habitStart ? from : habitStart, to < today ? to : today);
}
function percent(ratio) {
	if (ratio.total === 0) return 0;
	return Math.round(ratio.done / ratio.total * 100);
}
function sumRatios(ratios) {
	return ratios.reduce((acc, ratio) => ({
		done: acc.done + ratio.done,
		total: acc.total + ratio.total
	}), {
		done: 0,
		total: 0
	});
}
function nextColor(habits) {
	const used = new Set(habits.map((habit) => habit.color));
	return HABIT_COLORS.find((color) => !used.has(color)) ?? "pine";
}
function toggleCheck(state, habitId, iso, today) {
	const habit = state.habits.find((item) => item.id === habitId);
	if (!habit || !canToggle(habit, iso, today)) return state;
	const current = new Set(state.checks[habitId] ?? []);
	if (current.has(iso)) current.delete(iso);
	else current.add(iso);
	return {
		...state,
		checks: {
			...state.checks,
			[habitId]: [...current].sort()
		}
	};
}
function addHabit(state, name, color, today) {
	const trimmed = name.trim().replace(/\s+/g, " ");
	if (!trimmed || trimmed.length > 40 || state.habits.length >= 12) return state;
	const habit = {
		id: crypto.randomUUID(),
		name: trimmed,
		color,
		createdAt: today
	};
	return {
		habits: [...state.habits, habit],
		checks: {
			...state.checks,
			[habit.id]: []
		}
	};
}
function updateHabit(state, id, patch) {
	const name = patch.name?.trim().replace(/\s+/g, " ");
	if (name !== void 0 && (!name || name.length > 40)) return state;
	return {
		...state,
		habits: state.habits.map((habit) => habit.id === id ? {
			...habit,
			name: name ?? habit.name,
			color: patch.color ?? habit.color
		} : habit)
	};
}
function deleteHabit(state, id) {
	const checks = { ...state.checks };
	delete checks[id];
	return {
		habits: state.habits.filter((habit) => habit.id !== id),
		checks
	};
}
function hash(seed, iso) {
	let h = seed >>> 0;
	for (let i = 0; i < iso.length; i += 1) h = Math.imul(h, 33) + iso.charCodeAt(i) >>> 0;
	return h % 100;
}
function fillRange(dates, from, to) {
	for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) dates.add(cursor);
}
var SEED = [
	{
		id: "h-pages",
		name: "Morning pages",
		color: "pine",
		startDaysAgo: 42,
		rate: 74,
		streak: 11,
		todayOn: false
	},
	{
		id: "h-walk",
		name: "Walk outside",
		color: "sea",
		startDaysAgo: 28,
		rate: 70,
		streak: 6,
		todayOn: true
	},
	{
		id: "h-read",
		name: "Read twenty pages",
		color: "clay",
		startDaysAgo: 50,
		rate: 60,
		streak: 0,
		todayOn: false,
		pastRun: {
			endDaysAgo: 16,
			length: 8
		}
	},
	{
		id: "h-lights",
		name: "Lights out by eleven",
		color: "slate",
		startDaysAgo: 18,
		rate: 66,
		streak: 4,
		todayOn: false
	}
];
function createSeed(today = todayISO()) {
	const habits = [];
	const checks = {};
	SEED.forEach((spec, index) => {
		const createdAt = addDays(today, -spec.startDaysAgo);
		habits.push({
			id: spec.id,
			name: spec.name,
			color: spec.color,
			createdAt
		});
		const dates = /* @__PURE__ */ new Set();
		for (let cursor = createdAt; cursor <= today; cursor = addDays(cursor, 1)) if (hash((index + 1) * 97, cursor) < spec.rate) dates.add(cursor);
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
	return {
		habits,
		checks
	};
}
function parseState(raw) {
	let data;
	try {
		data = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!data || typeof data !== "object") return null;
	const record = data;
	if (!Array.isArray(record.habits) || !record.checks || typeof record.checks !== "object") return null;
	const habits = [];
	for (const item of record.habits) {
		if (!item || typeof item !== "object") return null;
		const habit = item;
		if (typeof habit.id !== "string" || !habit.id) return null;
		if (typeof habit.name !== "string") return null;
		if (typeof habit.color !== "string" || !COLOR_SET.has(habit.color)) return null;
		if (typeof habit.createdAt !== "string" || !ISO.test(habit.createdAt)) return null;
		const name = habit.name.trim().replace(/\s+/g, " ");
		if (!name || name.length > 40) return null;
		habits.push({
			id: habit.id,
			name,
			color: habit.color,
			createdAt: habit.createdAt
		});
	}
	if (habits.length > 12) return null;
	const ids = new Set(habits.map((habit) => habit.id));
	const checks = {};
	for (const [id, dates] of Object.entries(record.checks)) {
		if (!ids.has(id) || !Array.isArray(dates)) continue;
		checks[id] = [...new Set(dates.filter((date) => typeof date === "string" && ISO.test(date)))].sort();
	}
	for (const id of ids) if (!checks[id]) checks[id] = [];
	return {
		habits,
		checks
	};
}
function loadState() {
	if (typeof window === "undefined") return createSeed();
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return createSeed();
		return parseState(raw) ?? createSeed();
	} catch {
		return createSeed();
	}
}
function saveState(state) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {}
}
function streakCaption(streak, todayDone) {
	if (streak <= 0) return "No streak yet";
	const label = streak === 1 ? "1 day" : `${streak} days`;
	return todayDone ? label : `${label} · open today`;
}
function HabitDialog({ open, mode, initialName, initialColor, onClose, onSubmit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => !next && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "rite-overlay fixed inset-0 z-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "rite-dialog fixed top-1/2 right-4 left-4 z-50 max-h-[calc(100dvh-2rem)] -translate-y-1/2 overflow-y-auto rounded-xl border border-line bg-card p-4 outline-none sm:right-auto sm:left-1/2 sm:w-full sm:max-w-sm sm:-translate-x-1/2",
			children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitForm, {
				mode,
				initialName,
				initialColor,
				onClose,
				onSubmit
			}, `${mode}:${initialName}:${initialColor}`) : null
		})] })
	});
}
function HabitForm({ mode, initialName, initialColor, onClose, onSubmit }) {
	const [name, setName] = (0, import_react.useState)(initialName);
	const [color, setColor] = (0, import_react.useState)(initialColor);
	const [error, setError] = (0, import_react.useState)("");
	function submit(event) {
		event.preventDefault();
		const next = name.trim().replace(/\s+/g, " ");
		if (!next) {
			setError("Give this habit a name.");
			return;
		}
		if (next.length > 40) {
			setError(`Keep the name under 40 characters.`);
			return;
		}
		onSubmit(next, color);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-2xl leading-none font-medium text-ink",
					children: mode === "add" ? "New habit" : "Edit habit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					type: "button",
					"aria-label": "Close",
					className: "pressable flex size-11 items-center justify-center rounded-sm text-muted hover:bg-paper-deep hover:text-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "mt-2 text-sm text-muted",
				children: mode === "add" ? "Name something you can finish in a day. History starts today." : "The name and color change. Check-ins stay."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: "habit-name",
				className: "mt-5 block text-sm font-medium text-ink",
				children: "Name"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "habit-name",
				value: name,
				autoFocus: true,
				maxLength: 40,
				autoComplete: "off",
				onChange: (event) => {
					setName(event.target.value);
					if (error) setError("");
				},
				"aria-invalid": error ? true : void 0,
				"aria-describedby": error ? "habit-name-error" : void 0,
				className: "mt-2 h-11 w-full rounded-sm border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: "habit-name-error",
				className: "mt-2 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-sm font-medium text-ink",
						children: "Color"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [COLOR_LABEL[color], " marks it on the calendar."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						role: "radiogroup",
						"aria-label": "Color",
						children: HABIT_COLORS.map((option) => {
							const selected = option === color;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "radio",
								"aria-checked": selected,
								"aria-label": COLOR_LABEL[option],
								onClick: () => setColor(option),
								className: cn("pressable flex size-11 items-center justify-center rounded-full", COLOR_UI[option].dot, selected && "ring-2 ring-ink ring-offset-2 ring-offset-card"),
								children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "size-4 text-paper",
									strokeWidth: 2.5
								}) : null
							}, option);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "pressable h-11 rounded-sm border border-line bg-card px-4 text-sm font-medium text-ink hover:bg-paper-deep",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "pressable h-11 rounded-sm bg-ink px-4 text-sm font-medium text-paper hover:opacity-90",
					children: mode === "add" ? "Add habit" : "Save"
				})]
			})
		]
	});
}
function ConfirmRemove({ habit, onCancel, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: habit !== null,
		onOpenChange: (next) => !next && onCancel(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, { className: "rite-overlay fixed inset-0 z-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "rite-dialog fixed top-1/2 right-4 left-4 z-50 -translate-y-1/2 rounded-xl border border-line bg-card p-4 outline-none sm:right-auto sm:left-1/2 sm:w-full sm:max-w-sm sm:-translate-x-1/2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "font-display text-2xl leading-none font-medium text-ink",
					children: [
						"Remove ",
						habit?.name,
						"?"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
					className: "mt-2 text-sm text-muted",
					children: "Its check-ins will be deleted from this browser. This cannot be undone."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						className: "pressable h-11 rounded-sm border border-line bg-card px-4 text-sm font-medium text-ink hover:bg-paper-deep",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: onConfirm,
						className: "pressable h-11 rounded-sm bg-danger px-4 text-sm font-medium text-paper hover:opacity-90",
						children: "Remove"
					})]
				})
			]
		})] })
	});
}
function RiteApp() {
	const [state, setState] = (0, import_react.useState)(() => typeof window === "undefined" ? null : loadState());
	const [today, setToday] = (0, import_react.useState)(todayISO);
	(0, import_react.useEffect)(() => {
		if (!state) setState(loadState());
	}, [state]);
	(0, import_react.useEffect)(() => {
		if (state) saveState(state);
	}, [state]);
	(0, import_react.useEffect)(() => {
		const sync = () => setToday(todayISO());
		document.addEventListener("visibilitychange", sync);
		const id = window.setInterval(sync, 6e4);
		return () => {
			document.removeEventListener("visibilitychange", sync);
			window.clearInterval(id);
		};
	}, []);
	if (!state) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh w-full max-w-5xl px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl leading-none text-ink",
			children: "Rite"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Loading your habits…"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiteBoard, {
		state,
		setState,
		today
	});
}
function RiteBoard({ state, setState, today }) {
	const [view, setView] = (0, import_react.useState)("week");
	const [cursor, setCursor] = (0, import_react.useState)(today);
	const [focus, setFocus] = (0, import_react.useState)("all");
	const [selectedDay, setSelectedDay] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const { habits } = state;
	const activeFocus = focus !== "all" && habits.some((habit) => habit.id === focus) ? focus : "all";
	const shown = activeFocus === "all" ? habits : habits.filter((habit) => habit.id === activeFocus);
	const progress = (0, import_react.useMemo)(() => {
		const active = habits.filter((habit) => habit.createdAt <= today);
		return {
			done: active.filter((habit) => isChecked(state, habit.id, today)).length,
			total: active.length
		};
	}, [
		habits,
		state,
		today
	]);
	const liveStreak = (0, import_react.useMemo)(() => {
		let best = 0;
		let name = "";
		for (const habit of habits) {
			const stats = habitStats(habit, checkSet(state, habit.id), today);
			if (stats.current > best) {
				best = stats.current;
				name = habit.name;
			}
		}
		return {
			best,
			name
		};
	}, [
		habits,
		state,
		today
	]);
	const weekRatio = (0, import_react.useMemo)(() => {
		const start = startOfWeek(today);
		return sumRatios(habits.map((habit) => ratioInRange(checkSet(state, habit.id), start, today, habit.createdAt, today)));
	}, [
		habits,
		state,
		today
	]);
	function commit(recipe) {
		setState((current) => current ? recipe(current) : current);
	}
	function openAdd() {
		setDraft({ mode: "add" });
	}
	function changeView(next) {
		setView(next);
		if (next === "month") setSelectedDay(monthKey(cursor) === monthKey(today) ? today : null);
	}
	const floor = addDays(today, -400);
	const canPrev = view === "week" ? addDays(startOfWeek(cursor), -7) >= startOfWeek(floor) : monthKey(addMonths(cursor, -1)) >= monthKey(floor);
	const canNext = view === "week" ? startOfWeek(cursor) < startOfWeek(today) : monthKey(cursor) < monthKey(today);
	const onToday = view === "week" ? startOfWeek(cursor) === startOfWeek(today) : monthKey(cursor) === monthKey(today);
	function shift(direction) {
		setCursor((current) => view === "week" ? addDays(startOfWeek(current), direction * 7) : addMonths(current, direction));
		if (view === "month") setSelectedDay(null);
	}
	const atLimit = habits.length >= 12;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl leading-none font-medium tracking-tight text-ink",
					children: "Rite"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: formatLong(today)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewToggle, {
						view,
						onChange: changeView
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: openAdd,
						disabled: atLimit,
						title: atLimit ? "Twelve habits is the limit for a board you can still scan" : void 0,
						className: "pressable inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add habit"]
					})]
				})]
			}),
			habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { onAdd: openAdd }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-label": "Summary",
						className: "grid grid-cols-3 gap-2 sm:gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Today",
								value: progress.total === 0 ? "—" : `${progress.done}/${progress.total}`,
								caption: progress.total === 0 ? "Nothing scheduled" : progress.done === progress.total ? "All kept" : `${progress.total - progress.done} still open`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Live streak",
								value: liveStreak.best === 0 ? "0" : String(liveStreak.best),
								caption: liveStreak.best === 0 ? "Check in today" : liveStreak.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "This week",
								value: weekRatio.total === 0 ? "—" : `${percent(weekRatio)}%`,
								caption: weekRatio.total === 0 ? "Starts when you do" : `${weekRatio.done} of ${weekRatio.total}`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium text-ink",
							children: "Check off"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted tabular-nums",
							children: [
								progress.done,
								" of ",
								progress.total
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 overflow-hidden rounded-xl border border-line bg-card",
						children: habits.map((habit, index) => {
							const stats = habitStats(habit, checkSet(state, habit.id), today);
							const on = stats.todayDone;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("flex items-center gap-1 pr-1", index > 0 && "border-t border-line", activeFocus === habit.id && "bg-paper"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
										on,
										color: habit.color,
										todayMark: true,
										label: on ? `Clear ${habit.name} for today` : `Mark ${habit.name} done for today`,
										onToggle: () => commit((current) => toggleCheck(current, habit.id, today, today))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": activeFocus === habit.id,
										onClick: () => setFocus((current) => current === habit.id ? "all" : habit.id),
										className: "min-w-0 flex-1 py-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-medium text-ink",
											children: habit.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-xs text-muted",
											children: streakCaption(stats.current, stats.todayDone)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitMenu, {
										habit,
										onEdit: () => setDraft({
											mode: "edit",
											habit
										}),
										onDelete: () => setPendingDelete(habit)
									})
								]
							}, habit.id);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCard, {
						state,
						today,
						view,
						cursor,
						focus: activeFocus,
						shown,
						habits,
						selectedDay,
						canPrev,
						canNext,
						onToday,
						onShift: shift,
						onJumpToday: () => {
							setCursor(today);
							if (view === "month") setSelectedDay(today);
						},
						onFocus: setFocus,
						onSelectDay: setSelectedDay,
						onToggle: (habitId, iso) => commit((current) => toggleCheck(current, habitId, iso, today))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Record, {
						state,
						today,
						onEdit: (habit) => setDraft({
							mode: "edit",
							habit
						}),
						onDelete: setPendingDelete
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-faint",
						children: "Saved in this browser. Sample habits can be removed anytime."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitDialog, {
				open: draft !== null,
				mode: draft?.mode ?? "add",
				initialName: draft?.mode === "edit" ? draft.habit.name : "",
				initialColor: draft?.mode === "edit" ? draft.habit.color : nextColor(habits),
				onClose: () => setDraft(null),
				onSubmit: (name, color) => {
					if (draft?.mode === "edit") commit((current) => updateHabit(current, draft.habit.id, {
						name,
						color
					}));
					else commit((current) => addHabit(current, name, color, today));
					setDraft(null);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmRemove, {
				habit: pendingDelete,
				onCancel: () => setPendingDelete(null),
				onConfirm: () => {
					if (!pendingDelete) return;
					const id = pendingDelete.id;
					commit((current) => deleteHabit(current, id));
					if (focus === id) setFocus("all");
					setPendingDelete(null);
				}
			})
		]
	});
}
function Stat({ label, value, caption }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "min-w-0 rounded-lg border border-line bg-card px-3 py-3 sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs font-medium tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate font-display text-2xl leading-none font-medium text-ink tabular-nums sm:text-3xl",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-xs text-muted",
				children: caption
			})
		]
	});
}
function ViewToggle({ view, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex rounded-full bg-paper-deep p-1",
		role: "tablist",
		"aria-label": "Calendar view",
		children: ["week", "month"].map((option) => {
			const selected = view === option;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": selected,
				onClick: () => onChange(option),
				className: cn("pressable h-11 rounded-full px-4 text-sm font-medium capitalize", selected ? "bg-ink text-paper" : "text-muted hover:text-ink"),
				children: option
			}, option);
		})
	});
}
function EmptyState({ onAdd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-xl border border-line bg-card px-5 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl font-medium text-ink",
				children: "Nothing kept yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-sm text-sm text-muted",
				children: "Add a habit you can finish in a day. Check it off when it is done, and the calendar will start to fill."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onAdd,
				className: "pressable mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add habit"]
			})
		]
	});
}
function Mark({ on, color, label, todayMark, disabled, onToggle }) {
	const ui = COLOR_UI[color];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled,
		"aria-pressed": on,
		"aria-label": label,
		onClick: onToggle,
		className: "pressable flex size-11 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("flex size-8 items-center justify-center rounded-full", on && ui.fill, !on && !disabled && cn("bg-card ring-inset", todayMark ? "ring-2" : "ring-1", ui.ring)),
			children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "size-4",
				strokeWidth: 2.5
			}) : null
		})
	});
}
function HabitMenu({ habit, onEdit, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": `Actions for ${habit.name}`,
			className: "pressable flex size-11 items-center justify-center rounded-sm text-muted hover:bg-paper-deep hover:text-ink",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		sideOffset: 4,
		className: "menu-panel z-50 min-w-40 rounded-lg border border-line bg-card p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
			onSelect: onEdit,
			className: "flex h-11 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-ink outline-none data-[highlighted]:bg-paper-deep",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Edit"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
			onSelect: onDelete,
			className: "flex h-11 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-danger outline-none data-[highlighted]:bg-paper-deep",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Remove"]
		})]
	}) })] });
}
function CalendarCard({ state, today, view, cursor, focus, shown, habits, selectedDay, canPrev, canNext, onToday, onShift, onJumpToday, onFocus, onSelectDay, onToggle }) {
	const periodStart = view === "week" ? startOfWeek(cursor) : `${monthKey(cursor)}-01`;
	const periodEnd = view === "week" ? addDays(periodStart, 6) : addDays(addMonths(`${monthKey(cursor)}-01`, 1), -1);
	const periodRatio = sumRatios(shown.map((habit) => ratioInRange(checkSet(state, habit.id), periodStart, periodEnd, habit.createdAt, today)));
	const label = view === "week" ? formatWeekSpan(startOfWeek(cursor)) : formatMonth(cursor);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-xl border border-line bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-b border-line px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-medium text-ink",
						children: view === "week" ? "This week" : "This month"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted tabular-nums",
						children: periodRatio.total === 0 ? "No days in range yet" : `${periodRatio.done} of ${periodRatio.total} kept`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						!onToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onJumpToday,
							className: "pressable h-11 rounded-sm px-3 text-sm font-medium text-ink hover:bg-paper-deep",
							children: "Today"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": view === "week" ? "Previous week" : "Previous month",
							disabled: !canPrev,
							onClick: () => onShift(-1),
							className: "pressable flex size-11 items-center justify-center rounded-sm text-ink hover:bg-paper-deep disabled:opacity-30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-28 text-center text-sm font-medium text-ink tabular-nums",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": view === "week" ? "Next week" : "Next month",
							disabled: !canNext,
							onClick: () => onShift(1),
							className: "pressable flex size-11 items-center justify-center rounded-sm text-ink hover:bg-paper-deep disabled:opacity-30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scroll-thin flex gap-2 overflow-x-auto px-3 py-3 sm:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: focus === "all",
					onClick: () => onFocus("all"),
					children: "All"
				}), habits.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterChip, {
					active: focus === habit.id,
					onClick: () => onFocus(habit.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 shrink-0 rounded-full", COLOR_UI[habit.color].dot) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: habit.name
					})]
				}, habit.id))]
			}),
			view === "week" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekBoard, {
				state,
				today,
				cursor,
				shown,
				onToggle
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthBoard, {
				state,
				today,
				cursor,
				shown,
				focus,
				selectedDay,
				onSelectDay,
				onToggle
			})
		]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: cn("pressable inline-flex h-11 max-w-52 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-medium", active ? "bg-ink text-paper" : "border border-line bg-card text-ink hover:bg-paper-deep"),
		children
	});
}
function WeekBoard({ state, today, cursor, shown, onToggle }) {
	const days = weekDates(cursor);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "week-scroll scroll-thin border-t border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "week-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "week-sticky border-r border-b border-line px-3 py-2 text-xs font-medium tracking-wide text-muted uppercase",
					children: "Habit"
				}),
				days.map((iso, index) => {
					const isToday = iso === today;
					const weekend = index >= 5;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("border-b border-line px-1 py-2 text-center", isToday ? "bg-paper" : void 0),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-xs font-medium", weekend && !isToday ? "text-faint" : "text-muted"),
								children: formatWeekday(iso)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-sm tabular-nums", isToday ? "font-semibold text-ink" : "text-muted"),
								children: dayNumber(iso)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mx-auto mt-1 block h-0.5 w-3 rounded-full", isToday ? "bg-ink" : "bg-transparent") })
						]
					}, iso);
				}),
				shown.map((habit) => {
					const dates = checkSet(state, habit.id);
					const ui = COLOR_UI[habit.color];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekRow, {
						habit,
						days,
						dates,
						today,
						uiTrack: ui.track,
						uiFill: ui.fill,
						uiRing: ui.ring,
						onToggle
					}, habit.id);
				})
			]
		})
	});
}
function WeekRow({ habit, days, dates, today, uiTrack, uiFill, uiRing, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "week-sticky flex items-center border-r border-b border-line px-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-sm font-medium text-ink",
			children: habit.name
		})
	}), days.map((iso) => {
		const on = dates.has(iso);
		const allowed = canToggle(habit, iso, today);
		const prevOn = dates.has(addDays(iso, -1));
		const nextOn = dates.has(addDays(iso, 1)) && addDays(iso, 1) <= today;
		const isToday = iso === today;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("border-b border-line", isToday && "bg-paper"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: !allowed,
				"aria-pressed": on,
				"aria-label": allowed ? `${on ? "Clear" : "Mark"} ${habit.name} for ${formatLong(iso)}` : `${habit.name} is not tracked on ${formatLong(iso)}`,
				onClick: () => onToggle(habit.id, iso),
				className: "pressable relative flex h-11 w-full items-center justify-center disabled:cursor-default",
				children: [
					on && prevOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-1/2 left-0 h-2 w-1/2 -translate-y-1/2", uiTrack) }) : null,
					on && nextOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-1/2 right-0 h-2 w-1/2 -translate-y-1/2", uiTrack) }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("relative z-10 flex size-8 items-center justify-center rounded-full", on && uiFill, !on && allowed && cn("bg-card ring-1 ring-inset", isToday && "ring-2", uiRing)),
						children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-4",
							strokeWidth: 2.5
						}) : null
					})
				]
			})
		}, iso);
	})] });
}
function MonthBoard({ state, today, cursor, shown, focus, selectedDay, onSelectDay, onToggle }) {
	const cells = monthGrid(cursor);
	const weekdays = weekDates(cursor);
	const single = focus !== "all" ? shown[0] : void 0;
	const activeDay = selectedDay && monthKey(selectedDay) === monthKey(cursor) && focus === "all" ? selectedDay : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-line px-2 py-3 sm:px-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-7",
			children: [weekdays.map((iso, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("pb-2 text-center text-xs font-medium", index >= 5 ? "text-faint" : "text-muted"),
				children: formatWeekday(iso)
			}, iso)), cells.map((cell) => {
				if (!cell.inMonth) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "min-h-16"
				}, cell.iso);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthCell, {
					iso: cell.iso,
					today,
					state,
					shown,
					single,
					selected: activeDay === cell.iso,
					onSelectDay,
					onToggle
				}, cell.iso);
			})]
		}), activeDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPanel, {
			iso: activeDay,
			today,
			state,
			habits: shown,
			onToggle
		}) : focus === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-2 pt-3 text-sm text-muted",
			children: "Select a day to check habits on or off."
		}) : null]
	});
}
function MonthCell({ iso, today, state, shown, single, selected, onSelectDay, onToggle }) {
	const future = iso > today;
	const eligible = shown.filter((habit) => habit.createdAt <= iso && iso <= today);
	const done = eligible.filter((habit) => isChecked(state, habit.id, iso));
	const full = eligible.length > 0 && done.length === eligible.length;
	const isToday = iso === today;
	const numberClass = cn("flex size-6 items-center justify-center rounded-full text-xs tabular-nums", full && "bg-ink text-paper", isToday && !full && "ring-1 ring-ink text-ink", !full && !isToday && done.length === 0 && "text-faint", !full && !isToday && done.length > 0 && "text-ink");
	if (single) {
		const allowed = canToggle(single, iso, today);
		const on = isChecked(state, single.id, iso);
		const ui = COLOR_UI[single.color];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled: !allowed,
			"aria-pressed": on,
			"aria-current": isToday ? "date" : void 0,
			"aria-label": allowed ? `${on ? "Clear" : "Mark"} ${single.name} for ${formatLong(iso)}` : `${formatLong(iso)} is outside ${single.name}`,
			onClick: () => onToggle(single.id, iso),
			className: "pressable flex min-h-20 flex-col items-center justify-center gap-1 rounded-sm disabled:cursor-default",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: numberClass,
				children: dayNumber(iso)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex size-8 items-center justify-center rounded-full", on && ui.fill, !on && allowed && cn("ring-1 ring-inset", isToday && "ring-2", ui.ring), future && "opacity-40"),
				children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-4",
					strokeWidth: 2.5
				}) : null
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": selected,
		"aria-current": isToday ? "date" : void 0,
		"aria-label": `${formatLong(iso)}, ${done.length} of ${eligible.length} kept`,
		onClick: () => onSelectDay(iso),
		className: cn("pressable flex min-h-20 flex-col items-center gap-1 rounded-sm px-0.5 py-1", selected && "bg-paper-deep"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: numberClass,
			children: dayNumber(iso)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex min-h-4 max-w-full flex-wrap justify-center gap-0.5",
			children: done.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", COLOR_UI[habit.color].dot) }, habit.id))
		})]
	});
}
function DayPanel({ iso, today, state, habits, onToggle }) {
	const future = iso > today;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 border-t border-line px-2 pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg font-medium text-ink",
				children: formatLong(iso)
			}),
			future ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "This day has not arrived."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2",
				children: habits.map((habit) => {
					const allowed = canToggle(habit, iso, today);
					const on = isChecked(state, habit.id, iso);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 border-b border-line last:border-b-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-center gap-2 text-sm text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 shrink-0 rounded-full", COLOR_UI[habit.color].dot) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: habit.name
							})]
						}), allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
							on,
							color: habit.color,
							todayMark: iso === today,
							label: `${on ? "Clear" : "Mark"} ${habit.name} for ${formatLong(iso)}`,
							onToggle: () => onToggle(habit.id, iso)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pr-3 text-xs text-faint",
							children: future ? "Ahead" : "Not started"
						})]
					}, habit.id);
				})
			})
		]
	});
}
function Record({ state, today, onEdit, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-medium text-ink",
			children: "Record"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Streaks count through yesterday until you check off today."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 grid gap-3 sm:grid-cols-2",
			children: state.habits.map((habit) => {
				const stats = habitStats(habit, checkSet(state, habit.id), today);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-line bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 shrink-0 rounded-full", COLOR_UI[habit.color].dot) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-sm font-medium text-ink",
									children: habit.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: streakCaption(stats.current, stats.todayDone)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitMenu, {
							habit,
							onEdit: () => onEdit(habit),
							onDelete: () => onDelete(habit)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-2 gap-x-4 gap-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Streak",
								value: String(stats.current)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Best",
								value: String(stats.longest)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "7 days",
								value: formatRatio(stats.week)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "30 days",
								value: formatRatio(stats.month)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 flex items-baseline justify-between gap-3 border-t border-line pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted",
									children: "Since start"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-sm font-medium text-ink tabular-nums",
									children: stats.since.total === 0 ? "—" : `${percent(stats.since)}% · ${formatRatio(stats.since)}`
								})]
							})
						]
					})]
				}, habit.id);
			})
		})
	] });
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5 font-display text-xl leading-none font-medium text-ink tabular-nums",
		children: value
	})] });
}
function formatRatio(ratio) {
	if (ratio.total === 0) return "—";
	return `${ratio.done}/${ratio.total}`;
}
var SplitComponent = RiteApp;
//#endregion
export { SplitComponent as component };
