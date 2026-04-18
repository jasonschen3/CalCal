"use client";

import { useRouter } from "next/navigation";
import { GradeBadge } from "@/components/ui/GradeBadge";
import type { Grade } from "@/types";

const HISTORY = [
  {
    date: "Today",
    grade: "A" as Grade,
    meals: [
      { label: "Breakfast", grade: "A" as Grade, detail: "Scrambled eggs & Greek yogurt" },
      { label: "Lunch", grade: "A+" as Grade, detail: "CAVA Harvest Bowl" },
      { label: "Dinner", grade: "A-" as Grade, detail: "Home — salmon and rice" },
    ],
  },
  {
    date: "Yesterday",
    grade: "B+" as Grade,
    meals: [
      { label: "Breakfast", grade: "A" as Grade, detail: "Protein smoothie" },
      { label: "Lunch", grade: "B" as Grade, detail: "Chipotle burrito bowl" },
      { label: "Dinner", grade: "B+" as Grade, detail: "Pasta with chicken" },
    ],
  },
  {
    date: "2 days ago",
    grade: "A-" as Grade,
    meals: [
      { label: "Breakfast", grade: "A" as Grade, detail: "Oatmeal with berries" },
      { label: "Lunch", grade: "A-" as Grade, detail: "Sweetgreen harvest bowl" },
      { label: "Dinner", grade: "A" as Grade, detail: "Home — stir fry with tofu" },
    ],
  },
];

const WEEKLY_GRADES: { day: string; grade: Grade | null }[] = [
  { day: "M", grade: "A" },
  { day: "T", grade: "B+" },
  { day: "W", grade: "A-" },
  { day: "T", grade: null },
  { day: "F", grade: null },
  { day: "S", grade: null },
  { day: "S", grade: null },
];

function gradeColor(grade: Grade | null) {
  if (!grade) return "bg-gray-100";
  if (grade.startsWith("A")) return "bg-green-500";
  if (grade.startsWith("B")) return "bg-yellow-400";
  return "bg-orange-400";
}

export default function HistoryPage() {
  const router = useRouter();

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
            {WEEKLY_GRADES.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-full aspect-square rounded-lg ${gradeColor(item.grade)} flex items-center justify-center`}
                >
                  {item.grade && (
                    <span className="text-white text-xs font-bold">{item.grade}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-day breakdown */}
        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent days</h2>
        <div className="space-y-4">
          {HISTORY.map((day) => (
            <div key={day.date} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <p className="font-semibold text-gray-900">{day.date}</p>
                <GradeBadge grade={day.grade} />
              </div>
              <div className="px-5 py-3 space-y-2">
                {day.meals.map((meal, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">{meal.label}</span>
                      <p className="text-sm text-gray-700">{meal.detail}</p>
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
