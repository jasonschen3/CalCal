"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { mockMealWindows, mockDailySummary } from "@/lib/mock-data";
import type { MealWindow } from "@/types";

function GoalLabel(goal: string) {
  const map: Record<string, string> = {
    fat_loss: "Fat Loss",
    muscle_gain: "Muscle Gain",
    high_protein: "High Protein",
    high_energy: "High Energy",
    maintenance: "Maintenance",
  };
  return map[goal] || "High Protein";
}

function UrgencyBadge({ urgency }: { urgency: MealWindow["urgency"] }) {
  if (urgency === "now") return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Now</span>;
  if (urgency === "soon") return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Soon</span>;
  return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Later</span>;
}

function PathIcon({ path }: { path: MealWindow["recommendedPath"] }) {
  if (path === "eat_out") return <span title="Eat Out">🍽️</span>;
  if (path === "eat_at_home") return <span title="Eat at Home">🏠</span>;
  return <span title="Flexible">🔄</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/signin");
    },
  });

  const [goal, setGoal] = useState("high_protein");
  const [currentTime, setCurrentTime] = useState("");
  const [mealWindows, setMealWindows] = useState<MealWindow[]>(mockMealWindows);
  const [calendarLoaded, setCalendarLoaded] = useState(false);
  const [todayGrade, setTodayGrade] = useState<string | null>(null);
  const [todayLogs, setTodayLogs] = useState<{ label: string; name: string; grade: string }[]>([]);

  const userName = session?.user?.name?.split(" ")[0] ?? "there";

  useEffect(() => {
    const profile = localStorage.getItem("calcal_profile");
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        if (parsed.goal) setGoal(parsed.goal);
      } catch {}
    }
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/calendar/meal-windows")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setMealWindows(data);
      })
      .catch(() => {})
      .finally(() => setCalendarLoaded(true));

    fetch("/api/meals")
      .then((r) => r.json())
      .then((data) => {
        if (data.dailyGrade) setTodayGrade(data.dailyGrade);
        if (Array.isArray(data.logs)) setTodayLogs(data.logs);
      })
      .catch(() => {});
  }, [status]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (status === "loading") {
    return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CC</span>
            </div>
            <span className="font-bold text-gray-900">CalCal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/history" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              History
            </Link>
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt={userName} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-sm">
                {userName[0]}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">{today} · {currentTime}</p>
          <h1 className="text-2xl font-bold text-gray-900">Good {getTimeOfDay()}, {userName} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s your eating plan for today.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500 mb-1">Today&apos;s grade</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">{todayGrade ?? "—"}</span>
              <span className="text-xs text-gray-400">{todayGrade ? "logged" : "nothing logged"}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500 mb-1">Meal windows</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{mealWindows.length}</span>
              <span className="text-xs text-gray-400">{calendarLoaded ? "from calendar" : "identified"}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500 mb-1">Your goal</p>
            <p className="text-base font-semibold text-gray-900">{GoalLabel(goal)}</p>
          </div>
        </div>

        {/* Next up banner */}
        {mealWindows[0] && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-5 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs font-medium mb-1">UP NEXT</p>
                <h2 className="text-lg font-bold mb-0.5">{mealWindows[0].label}</h2>
                <p className="text-green-100 text-sm">{mealWindows[0].note}</p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-xs mb-1">{mealWindows[0].startTime}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/dashboard/eat-at-home?window=${mealWindows[0].id}`)}
                    className="bg-white text-green-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    🏠 At Home
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/eat-out?window=${mealWindows[0].id}`)}
                    className="bg-green-500 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-green-400 hover:bg-green-400 transition-colors"
                  >
                    🍽️ Eat Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meal windows */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Today&apos;s meal windows</h2>
          <div className="space-y-3">
            {mealWindows.map((window) => (
              <div
                key={window.id}
                onClick={() => router.push(`/dashboard/meal/${window.id}`)}
                className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UrgencyBadge urgency={window.urgency} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{window.label}</p>
                        <PathIcon path={window.recommendedPath} />
                      </div>
                      <p className="text-sm text-gray-500">
                        {window.startTime} – {window.endTime} · {window.durationMinutes}min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {window.grade && <GradeBadge grade={window.grade} />}
                    <span className="text-gray-300">›</span>
                  </div>
                </div>
                {window.note && (
                  <p className="text-xs text-gray-400 mt-2 ml-0">{window.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily breakdown */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Today&apos;s logged meals</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            {todayLogs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No meals logged yet today. Use Eat Out or Eat at Home to log a meal.</p>
            ) : (
              <div className="space-y-3">
                {todayLogs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">{log.label}</span>
                      <p className="text-sm text-gray-700">{log.name}</p>
                    </div>
                    <GradeBadge grade={log.grade as import("@/types").Grade} size="sm" />
                  </div>
                ))}
                {todayGrade && (
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Overall</span>
                    <GradeBadge grade={todayGrade as import("@/types").Grade} size="md" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
