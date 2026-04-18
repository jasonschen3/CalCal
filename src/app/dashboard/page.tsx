"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
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

export default function DashboardPage() {
  const router = useRouter();
  const [goal, setGoal] = useState("high_protein");
  const [userName, setUserName] = useState("Alex");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const profile = localStorage.getItem("calcal_profile");
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.goal) setGoal(parsed.goal);
    }
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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
            <div className="w-8 h-8 bg-[var(--primary-light)] rounded-full flex items-center justify-center text-[var(--primary-text)] font-extrabold text-sm">
              {userName[0]}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
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
              <span className="text-3xl font-extrabold" style={{ color: "var(--grade-a)" }}>{mockDailySummary.overallGrade}</span>
              <span className="text-xs text-[var(--text-faint)] font-medium">projected</span>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy">
            <p className="text-xs text-[var(--text-muted)] font-semibold mb-1">Meal windows</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--foreground)]">{mockMealWindows.length}</span>
              <span className="text-xs text-[var(--text-faint)] font-medium">identified</span>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy">
            <p className="text-xs text-[var(--text-muted)] font-semibold mb-1">Your goal</p>
            <p className="text-base font-extrabold text-[var(--foreground)]">{GoalLabel(goal)}</p>
          </div>
        </div>

        {/* Next up banner */}
        {mockMealWindows[0] && (
          <div className="bg-gradient-to-r from-[var(--primary)] to-[#d4824a] rounded-3xl p-5 mb-6 text-white shadow-cozy-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="stamp text-white/90 mb-2">Up Next</span>
                <h2 className="text-lg font-extrabold mb-0.5 mt-1">{mockMealWindows[0].label}</h2>
                <p className="text-white/80 text-sm font-medium">{mockMealWindows[0].note}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs font-medium mb-1">{mockMealWindows[0].startTime}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/dashboard/eat-at-home?window=${mockMealWindows[0].id}`)}
                    className="bg-[var(--surface-raised)] text-[var(--primary-text)] text-xs font-extrabold px-3 py-2 rounded-xl hover:bg-white transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="home" size={13} /> At Home
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/eat-out?window=${mockMealWindows[0].id}`)}
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
            {mockMealWindows.map((window) => (
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
          <h2 className="text-base font-extrabold text-[var(--foreground)] mb-4">Today&apos;s grades</h2>
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy">
            <div className="space-y-3">
              {mockDailySummary.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--foreground)] font-medium">{item.label}</span>
                  <GradeBadge grade={item.grade} size="sm" />
                </div>
              ))}
              <div className="border-t-2 border-[var(--border)] pt-3 flex items-center justify-between">
                <span className="text-sm font-extrabold text-[var(--foreground)]">Overall</span>
                <GradeBadge grade={mockDailySummary.overallGrade} size="md" />
              </div>
            </div>
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
