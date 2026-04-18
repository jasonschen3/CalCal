"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GradeBadge } from "@/components/ui/GradeBadge";
import type { Grade } from "@/types";

interface DayRecord {
  date: string;
  grade: Grade;
  meals: { label: string; grade: Grade; name: string; type: string }[];
}

function gradeColor(grade: Grade | null) {
  if (!grade) return "bg-gray-100";
  if (grade.startsWith("A")) return "bg-green-500";
  if (grade.startsWith("B")) return "bg-yellow-400";
  return "bg-orange-400";
}

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export default function HistoryPage() {
  const router = useRouter();
  const [days, setDays] = useState<DayRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/meals/history")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setDays(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build last-7-days heatmap
  const weekSlots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const day = days.find((r) => r.date === dateStr);
    return { day: d.toLocaleDateString("en-US", { weekday: "short" })[0], dateStr, grade: day?.grade ?? null };
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-gray-500 hover:text-gray-700 text-sm">
            ← Dashboard
          </button>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-900">History</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Weekly heatmap */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <p className="text-xs text-gray-400 font-medium mb-4">THIS WEEK</p>
          <div className="flex gap-2">
            {weekSlots.map((slot, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full aspect-square rounded-lg ${gradeColor(slot.grade)} flex items-center justify-center`}>
                  {slot.grade && <span className="text-white text-xs font-bold">{slot.grade}</span>}
                </div>
                <span className="text-xs text-gray-400">{slot.day}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent days</h2>

        {loading && <p className="text-sm text-gray-400">Loading...</p>}

        {!loading && days.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">No meals logged yet. Start tracking from the dashboard.</p>
          </div>
        )}

        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.date} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <p className="font-semibold text-gray-900">{formatDate(day.date)}</p>
                <GradeBadge grade={day.grade} />
              </div>
              <div className="px-5 py-3 space-y-2">
                {day.meals.map((meal, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">{meal.label} · {meal.type === "eat_out" ? "🍽️" : "🏠"}</span>
                      <p className="text-sm text-gray-700">{meal.name}</p>
                    </div>
                    <GradeBadge grade={meal.grade} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
