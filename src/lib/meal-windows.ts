import type { MealWindow } from "@/types";

interface CalEvent {
  start: string;
  end: string;
  summary?: string;
}

function fmt(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function urgency(start: Date, end: Date, now: Date): MealWindow["urgency"] {
  if (now >= start && now <= end) return "now";
  const msToStart = start.getTime() - now.getTime();
  if (msToStart > 0 && msToStart <= 2 * 60 * 60 * 1000) return "soon";
  return "upcoming";
}

function recommendedPath(mins: number): MealWindow["recommendedPath"] {
  if (mins < 45) return "eat_at_home";
  if (mins > 75) return "eat_out";
  return "flexible";
}

export function computeMealWindows(events: CalEvent[]): MealWindow[] {
  const now = new Date();

  const dayStart = new Date(now);
  dayStart.setHours(7, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setHours(22, 0, 0, 0);

  // Filter to events that overlap today's window and have proper datetimes
  const sorted = events
    .filter((e) => e.start && e.end && e.start.includes("T")) // skip all-day
    .map((e) => ({ start: new Date(e.start), end: new Date(e.end), summary: e.summary }))
    .filter((e) => e.end > dayStart && e.start < dayEnd)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // Find free gaps ≥ 30 min
  const gaps: { start: Date; end: Date }[] = [];
  let cursor = dayStart;

  for (const event of sorted) {
    const eStart = event.start < dayStart ? dayStart : event.start;
    if (eStart > cursor) {
      const gapMins = (eStart.getTime() - cursor.getTime()) / 60000;
      if (gapMins >= 30) gaps.push({ start: cursor, end: eStart });
    }
    if (event.end > cursor) cursor = event.end;
  }
  // Gap after last event
  if (cursor < dayEnd) {
    const gapMins = (dayEnd.getTime() - cursor.getTime()) / 60000;
    if (gapMins >= 30) gaps.push({ start: cursor, end: dayEnd });
  }

  // Pick one gap per meal slot
  const mealSlots = [
    { label: "Breakfast", minHour: 7, maxHour: 10 },
    { label: "Lunch Window", minHour: 11, maxHour: 14 },
    { label: "Dinner", minHour: 17, maxHour: 21 },
  ];

  const windows: MealWindow[] = [];
  let idCounter = 1;

  for (const slot of mealSlots) {
    const candidates = gaps.filter((g) => {
      const h = g.start.getHours();
      return h >= slot.minHour && h <= slot.maxHour;
    });
    if (!candidates.length) continue;

    // Prefer the largest gap in the slot
    const best = candidates.reduce((a, b) =>
      b.end.getTime() - b.start.getTime() > a.end.getTime() - a.start.getTime() ? b : a
    );

    const rawMins = Math.floor((best.end.getTime() - best.start.getTime()) / 60000);
    const cappedMins = Math.min(rawMins, 90);
    const windowEnd = new Date(best.start.getTime() + cappedMins * 60000);

    // Find next event after this gap for context note
    const nextEvent = sorted.find((e) => e.start >= windowEnd);
    const note = nextEvent?.summary
      ? `${cappedMins} min before your "${nextEvent.summary}"`
      : undefined;

    windows.push({
      id: `mw_${idCounter++}`,
      label: slot.label,
      startTime: fmt(best.start),
      endTime: fmt(windowEnd),
      durationMinutes: cappedMins,
      urgency: urgency(best.start, windowEnd, now),
      recommendedPath: recommendedPath(cappedMins),
      note,
    });
  }

  return windows;
}
