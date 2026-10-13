import type { HabitColor } from "@/lib/habits/logic";

export const COLOR_LABEL: Record<HabitColor, string> = {
  pine: "Pine",
  sea: "Sea",
  clay: "Clay",
  slate: "Slate",
  stone: "Stone",
  rose: "Rose",
};

export const COLOR_UI: Record<
  HabitColor,
  { fill: string; ink: string; dot: string; track: string; ring: string }
> = {
  pine: {
    fill: "bg-habit-pine text-paper",
    ink: "text-habit-pine",
    dot: "bg-habit-pine",
    track: "bg-habit-pine/35",
    ring: "ring-habit-pine/55",
  },
  sea: {
    fill: "bg-habit-sea text-paper",
    ink: "text-habit-sea",
    dot: "bg-habit-sea",
    track: "bg-habit-sea/35",
    ring: "ring-habit-sea/55",
  },
  clay: {
    fill: "bg-habit-clay text-paper",
    ink: "text-habit-clay",
    dot: "bg-habit-clay",
    track: "bg-habit-clay/35",
    ring: "ring-habit-clay/55",
  },
  slate: {
    fill: "bg-habit-slate text-paper",
    ink: "text-habit-slate",
    dot: "bg-habit-slate",
    track: "bg-habit-slate/35",
    ring: "ring-habit-slate/55",
  },
  stone: {
    fill: "bg-habit-stone text-paper",
    ink: "text-habit-stone",
    dot: "bg-habit-stone",
    track: "bg-habit-stone/40",
    ring: "ring-habit-stone/60",
  },
  rose: {
    fill: "bg-habit-rose text-paper",
    ink: "text-habit-rose",
    dot: "bg-habit-rose",
    track: "bg-habit-rose/35",
    ring: "ring-habit-rose/55",
  },
};
