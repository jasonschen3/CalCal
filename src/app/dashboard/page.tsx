"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Icon } from "@/components/ui/Icon";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { mockMealWindows, mockDailySummary, mockRestaurants, mockMenuItems } from "@/lib/mock-data";
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
  if (urgency === "now") return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-lg border border-current/20 bg-[var(--urgency-now-bg)] text-[var(--urgency-now-text)]">Now</span>
  );
  if (urgency === "soon") return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-lg border border-current/20 bg-[var(--urgency-soon-bg)] text-[var(--urgency-soon-text)]">Soon</span>
  );
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-lg border border-current/20 bg-[var(--urgency-later-bg)] text-[var(--urgency-later-text)]">Later</span>
  );
}

function PathIcon({ path }: { path: MealWindow["recommendedPath"] }) {
  if (path === "eat_out") return <span title="Eat Out" className="text-[var(--primary-text)] opacity-70"><Icon name="utensils" size={14} /></span>;
  if (path === "eat_at_home") return <span title="Eat at Home" className="text-[var(--primary-text)] opacity-70"><Icon name="home" size={14} /></span>;
  return <span title="Flexible" className="text-[var(--primary-text)] opacity-70"><Icon name="refresh" size={14} /></span>;
}

type HungryState = "idle" | "loading" | "result";

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

  const [hungryState, setHungryState] = useState<HungryState>("idle");

  const topRestaurant = mockRestaurants[0];
  const topDish = mockMenuItems[0];

  const handleImHungry = () => {
    setHungryState("loading");
    setTimeout(() => setHungryState("result"), 1400);
  };

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
    <div className="min-h-screen bg-[var(--background)]">
      {/* Top nav */}
      <nav className="bg-[var(--surface-raised)] border-b-2 border-[var(--border)] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="CalCal" width={32} height={32} />
            <span className="font-extrabold text-[var(--foreground)]">CalCal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/history" className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
              History
            </Link>
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt={userName} className="w-8 h-8 rounded-full border-2 border-[var(--primary-light)]" />
            ) : (
              <div className="w-8 h-8 bg-[var(--primary-light)] rounded-full flex items-center justify-center text-[var(--primary-text)] font-extrabold text-sm">
                {userName[0]}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8 pb-28">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-[var(--text-muted)] font-medium mb-1">{today} · {currentTime}</p>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Good {getTimeOfDay()}, {userName}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1 font-medium">Here&apos;s your eating plan for today.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy">
            <p className="text-xs text-[var(--text-muted)] font-semibold mb-1">Today&apos;s grade</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold" style={{ color: "var(--grade-a)" }}>{todayGrade ?? "—"}</span>
              <span className="text-xs text-[var(--text-faint)] font-medium">{todayGrade ? "logged" : "nothing logged"}</span>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy">
            <p className="text-xs text-[var(--text-muted)] font-semibold mb-1">Meal windows</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--foreground)]">{mealWindows.length}</span>
              <span className="text-xs text-[var(--text-faint)] font-medium">{calendarLoaded ? "from calendar" : "identified"}</span>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy">
            <p className="text-xs text-[var(--text-muted)] font-semibold mb-1">Your goal</p>
            <p className="text-base font-extrabold text-[var(--foreground)]">{GoalLabel(goal)}</p>
          </div>
        </div>

        {/* Next up banner */}
        {mealWindows[0] && (
          <div className="bg-gradient-to-r from-[var(--primary)] to-[#d4824a] rounded-3xl p-5 mb-6 text-white shadow-cozy-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="stamp text-white/90 mb-2">Up Next</span>
                <h2 className="text-lg font-extrabold mb-0.5 mt-1">{mealWindows[0].label}</h2>
                <p className="text-white/80 text-sm font-medium">{mealWindows[0].note}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs font-medium mb-1">{mealWindows[0].startTime}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/dashboard/eat-at-home?window=${mealWindows[0].id}`)}
                    className="bg-[var(--surface-raised)] text-[var(--primary-text)] text-xs font-extrabold px-3 py-2 rounded-xl hover:bg-white transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="home" size={13} /> At Home
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/eat-out?window=${mealWindows[0].id}`)}
                    className="bg-[var(--primary-hover)] text-white text-xs font-extrabold px-3 py-2 rounded-xl border border-white/20 hover:bg-[var(--primary)] transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="utensils" size={13} /> Eat Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meal windows */}
        <div className="mb-8">
          <h2 className="text-base font-extrabold text-[var(--foreground)] mb-4">Today&apos;s meal windows</h2>
          <div className="space-y-3">
            {mealWindows.map((window) => (
              <div
                key={window.id}
                onClick={() => router.push(`/dashboard/meal/${window.id}`)}
                className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 cursor-pointer hover:shadow-cozy-md hover:border-[var(--border-strong)] transition-all shadow-cozy"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UrgencyBadge urgency={window.urgency} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[var(--foreground)]">{window.label}</p>
                        <PathIcon path={window.recommendedPath} />
                      </div>
                      <p className="text-sm text-[var(--text-muted)] font-medium">
                        {window.startTime} – {window.endTime} · {window.durationMinutes}min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {window.grade && <GradeBadge grade={window.grade} />}
                    <span className="text-[var(--border-strong)] font-bold">›</span>
                  </div>
                </div>
                {window.note && (
                  <p className="text-xs text-[var(--text-faint)] font-medium mt-2">{window.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily breakdown */}
        <div>
          <h2 className="text-base font-extrabold text-[var(--foreground)] mb-4">Today&apos;s logged meals</h2>
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy">
            {todayLogs.length === 0 ? (
              <p className="text-sm text-[var(--text-faint)] text-center py-4">No meals logged yet today. Use Eat Out or Eat at Home to log a meal.</p>
            ) : (
              <div className="space-y-3">
                {todayLogs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[var(--text-muted)] font-extrabold">{log.label}</span>
                      <p className="text-sm text-[var(--foreground)] font-medium">{log.name}</p>
                    </div>
                    <GradeBadge grade={log.grade as import("@/types").Grade} size="sm" />
                  </div>
                ))}
                {todayGrade && (
                  <div className="border-t-2 border-[var(--border)] pt-3 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[var(--foreground)]">Overall</span>
                    <GradeBadge grade={todayGrade as import("@/types").Grade} size="md" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky I'M HUNGRY! bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Loading state */}
        {hungryState === "loading" && (
          <div className="max-w-4xl mx-auto px-6 pb-6 fade-in">
            <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] px-6 py-4 shadow-cozy-md flex items-center gap-4">
              <div className="w-8 h-8 bg-[var(--primary-light)] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
              </div>
              <div>
                <p className="font-bold text-[var(--foreground)] text-sm">Finding your best option…</p>
                <p className="text-xs text-[var(--text-faint)] font-medium">Checking nearby spots · Matching your goal</p>
              </div>
            </div>
          </div>
        )}

        {/* Result bottom sheet */}
        {hungryState === "result" && (
          <div className="max-w-4xl mx-auto px-6 pb-6 fade-in">
            <div className="bg-gradient-to-r from-[var(--primary)] to-[#d4824a] rounded-3xl p-5 text-white shadow-cozy-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="stamp text-white/90">Found it</span>
                  <h2 className="text-lg font-extrabold mt-1">{topRestaurant.name}</h2>
                  <p className="text-white/80 text-sm font-medium">{topRestaurant.distanceMinutes} min away · {topRestaurant.cuisine}</p>
                </div>
                <div className="flex items-center gap-2">
                  <GradeBadge grade={topRestaurant.grade} size="lg" />
                  <button
                    onClick={() => setHungryState("idle")}
                    className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:bg-white/30 transition-colors text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="bg-white/15 rounded-2xl px-4 py-2.5 mb-3">
                <p className="text-xs text-white/70 font-bold mb-0.5">Top dish for your goal</p>
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-white text-sm">{topDish.name}</p>
                  <div className="flex gap-2 text-xs text-white/80 font-semibold">
                    <span>{topDish.estimatedCalories} cal</span>
                    <span>·</span>
                    <span>{topDish.estimatedProtein}g protein</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/dashboard/eat-out")}
                  className="flex-1 bg-white text-[var(--primary-text)] font-extrabold py-2.5 rounded-2xl hover:bg-[var(--primary-light)] transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Icon name="utensils" size={14} /> Head to {topRestaurant.name}
                </button>
                <button
                  onClick={() => router.push("/dashboard/eat-at-home")}
                  className="bg-white/20 text-white font-bold py-2.5 px-4 rounded-2xl hover:bg-white/30 transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon name="home" size={14} /> Cook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Idle button */}
        {hungryState === "idle" && (
          <div className="flex justify-center pb-8 pt-4" style={{ background: "linear-gradient(to top, var(--background) 60%, transparent)" }}>
            <button
              onClick={handleImHungry}
              className="flex items-center gap-2.5 font-extrabold text-white text-base px-8 py-4 rounded-full active:translate-y-1 transition-all tracking-wide"
              style={{
                background: "linear-gradient(135deg, #f4833d, #e05520)",
                boxShadow: "0 5px 0 #a83d12, 0 8px 24px rgba(224, 85, 32, 0.45)",
              }}
            >
              <Icon name="utensils" size={18} />
              I&apos;M HUNGRY!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
