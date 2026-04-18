"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { Icon } from "@/components/ui/Icon";
import type { HomeRecommendation } from "@/types";

export default function EatAtHomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputMode, setInputMode] = useState<"photo" | "text" | null>(null);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HomeRecommendation | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const LOADING_MESSAGES = [
    "Scanning your food...",
    "Analyzing nutrition options...",
    "Matching your goal...",
    "Generating recommendation...",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setInputMode("photo");
  };

  const handleAnalyze = async () => {
    setLoading(true);
    let msgIdx = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[msgIdx]);
    }, 700);

    try {
      const profile = JSON.parse(localStorage.getItem("calcal_profile") || "{}");
      const res = await fetch("/api/ai/home-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodDescription: text,
          imageIncluded: !!imagePreview,
          goal: profile.goal || "high_protein",
          restrictions: profile.restrictions || [],
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        bestOption: "Scrambled eggs with Greek yogurt and toast",
        alternatives: ["Greek yogurt with fruit", "Eggs on toast"],
        estimatedCalories: 520,
        estimatedProtein: 36,
        grade: "A",
        explanation: "Strong high-protein option using what you have. Eggs and Greek yogurt together hit your protein target efficiently.",
      });
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <nav className="bg-[var(--surface-raised)] border-b-2 border-[var(--border)]">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
            <button onClick={() => setResult(null)} className="text-[var(--text-muted)] hover:text-[var(--foreground)] text-sm font-semibold transition-colors">
              ← Try again
            </button>
            <span className="text-[var(--border-strong)]">|</span>
            <span className="font-bold text-[var(--foreground)]">Your Recommendation</span>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-6 py-8 fade-in">
          {/* Best option */}
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-6 mb-4 shadow-cozy">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="stamp text-[var(--text-muted)] mb-2">Best option right now</span>
                <h2 className="text-lg font-extrabold text-[var(--foreground)] mt-2">{result.bestOption}</h2>
              </div>
              <GradeBadge grade={result.grade} size="lg" />
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4 font-medium">{result.explanation}</p>
            <div className="flex gap-3">
              {result.estimatedCalories && (
                <span className="text-xs bg-[var(--background)] border-2 border-[var(--border)] text-[var(--text-muted)] px-3 py-1.5 rounded-full font-semibold">
                  ~{result.estimatedCalories} cal (est.)
                </span>
              )}
              {result.estimatedProtein && (
                <span className="text-xs bg-[var(--primary-light)] border-2 border-[var(--border-strong)] text-[var(--primary-text)] px-3 py-1.5 rounded-full font-semibold">
                  ~{result.estimatedProtein}g protein (est.)
                </span>
              )}
            </div>
          </div>

          {/* Alternatives */}
          {result.alternatives.length > 0 && (
            <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 mb-6 shadow-cozy">
              <span className="stamp text-[var(--text-muted)] mb-3">Alternatives</span>
              <div className="space-y-2 mt-3">
                {result.alternatives.map((alt, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b-2 border-[var(--border)] last:border-0">
                    <span className="w-5 h-5 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                      {i + 2}
                    </span>
                    <p className="text-sm text-[var(--foreground)] font-medium">{alt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-[var(--text-faint)] text-center mb-6 font-medium">
            * Nutrition estimates are approximate. Values may vary based on portion size.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-[var(--primary)] text-white font-extrabold py-3.5 rounded-2xl hover:bg-[var(--primary-hover)] transition-colors shadow-cozy"
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="bg-[var(--surface-raised)] border-b-2 border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-[var(--text-muted)] hover:text-[var(--foreground)] text-sm font-semibold transition-colors">
            ← Back
          </button>
          <span className="text-[var(--border-strong)]">|</span>
          <span className="font-bold text-[var(--foreground)]">Eat at Home</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-2">What do you have?</h1>
        <p className="text-[var(--text-muted)] text-sm mb-8 font-medium">
          Upload a photo of your fridge or pantry, or just describe what you have. We&apos;ll recommend the best meal for your goal.
        </p>

        {!loading ? (
          <>
            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => { setInputMode("photo"); fileInputRef.current?.click(); }}
                className={`bg-[var(--surface)] rounded-3xl border-2 p-5 text-center transition-all shadow-cozy ${
                  inputMode === "photo"
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-2 text-[var(--primary-text)]">
                  <Icon name="camera" size={22} />
                </div>
                <p className="font-bold text-[var(--foreground)] text-sm">Take a photo</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Snap fridge or pantry</p>
              </button>
              <button
                onClick={() => setInputMode("text")}
                className={`bg-[var(--surface)] rounded-3xl border-2 p-5 text-center transition-all shadow-cozy ${
                  inputMode === "text"
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-2 text-[var(--primary-text)]">
                  <Icon name="pencil" size={22} />
                </div>
                <p className="font-bold text-[var(--foreground)] text-sm">Describe it</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Type what you have</p>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Food" className="w-full rounded-3xl border-2 border-[var(--border)] object-cover max-h-64" />
              </div>
            )}

            {/* Text input */}
            {(inputMode === "text" || text) && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. eggs, Greek yogurt, leftover rice, spinach, bread, cheese..."
                rows={4}
                className="w-full border-2 border-[var(--border)] rounded-2xl p-4 text-sm text-[var(--foreground)] placeholder-[var(--text-faint)] outline-none focus:border-[var(--primary)] focus:ring-1 resize-none mb-4 bg-[var(--surface)] font-medium"
                style={{ focusRingColor: "var(--primary-light)" } as React.CSSProperties}
              />
            )}

            {(imagePreview || text.length > 3) && (
              <button
                onClick={handleAnalyze}
                className="w-full bg-[var(--primary)] text-white font-extrabold py-3.5 rounded-2xl hover:bg-[var(--primary-hover)] transition-colors shadow-cozy"
              >
                Get my recommendation →
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}></div>
            </div>
            <p className="text-[var(--foreground)] font-bold">{loadingMessage}</p>
            <p className="text-xs text-[var(--text-faint)] mt-2 font-medium">Powered by Claude AI</p>
          </div>
        )}
      </main>
    </div>
  );
}
