"use client";

import { useParams, useRouter } from "next/navigation";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { mockMealWindows } from "@/lib/mock-data";

export default function MealWindowPage() {
  const { id } = useParams();
  const router = useRouter();

  const window = mockMealWindows.find((w) => w.id === id) ?? mockMealWindows[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-900">{window.label}</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Window info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{window.label}</h1>
              <p className="text-gray-500 text-sm">
                {window.startTime} – {window.endTime} · {window.durationMinutes} minutes
              </p>
            </div>
            {window.grade && <GradeBadge grade={window.grade} size="lg" />}
          </div>
          {window.note && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <span>⏰</span>
              <p className="text-sm text-blue-700">{window.note}</p>
            </div>
          )}
        </div>

        {/* Two paths */}
        <h2 className="text-base font-semibold text-gray-900 mb-4">Choose your path</h2>

        <div className="space-y-4">
          {/* Eat Out */}
          <button
            onClick={() => router.push(`/dashboard/eat-out?window=${window.id}`)}
            className="w-full bg-white rounded-2xl border border-gray-100 p-6 text-left hover:shadow-md hover:border-green-200 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                  🍽️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-0.5">Eat Out</h3>
                  <p className="text-sm text-gray-500">Find nearby restaurants ranked by your goals</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-green-500 transition-colors text-xl">›</span>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">Location-aware</span>
              <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">Goal-matched</span>
              <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">Letter-graded</span>
            </div>
          </button>

          {/* Eat at Home */}
          <button
            onClick={() => router.push(`/dashboard/eat-at-home?window=${window.id}`)}
            className="w-full bg-white rounded-2xl border border-gray-100 p-6 text-left hover:shadow-md hover:border-green-200 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                  🏠
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-0.5">Eat at Home</h3>
                  <p className="text-sm text-gray-500">Snap a photo or list what you have — get a recommendation</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-green-500 transition-colors text-xl">›</span>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">Fridge scan</span>
              <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">AI-powered</span>
              <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">Instant grade</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
