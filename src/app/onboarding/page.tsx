"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon, type IconName } from "@/components/ui/Icon";

const GOALS: { id: string; label: string; icon: IconName; desc: string }[] = [
  { id: "fat_loss", label: "Fat Loss", icon: "flame", desc: "Prioritize lower calorie, high satiety meals" },
  { id: "muscle_gain", label: "Muscle Gain", icon: "dumbbell", desc: "Maximize protein and recovery nutrition" },
  { id: "high_protein", label: "High Protein", icon: "egg", desc: "Hit protein targets across every meal" },
  { id: "high_energy", label: "High Energy", icon: "bolt", desc: "Fuel focus and performance throughout the day" },
  { id: "maintenance", label: "Maintenance", icon: "scale", desc: "Balanced eating, no drastic changes" },
];

const RESTRICTIONS = [
  "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Halal", "Kosher", "Low carb", "Nut-free",
];

const STYLES: { id: string; label: string; icon: IconName; desc: string }[] = [
  { id: "grab_and_go", label: "Grab & Go", icon: "bolt", desc: "Quick and easy, minimal effort" },
  { id: "sit_down", label: "Sit-down meals", icon: "table", desc: "Prefer proper meal breaks" },
  { id: "budget", label: "Budget-conscious", icon: "coins", desc: "Value and affordability matter" },
  { id: "convenience", label: "Convenience-first", icon: "compass", desc: "Whatever is closest and fastest" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [style, setStyle] = useState("");
  const [meals, setMeals] = useState(3);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggleRestriction = (r: string) => {
    setRestrictions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const finish = () => {
    const profile = { goal, restrictions, style, meals, onboardingComplete: true };
    localStorage.setItem("calcal_profile", JSON.stringify(profile));
    localStorage.setItem("calcal_onboarding_complete", "true");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6ee] via-[#fef9f3] to-[#f5ede4] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/logo.svg" alt="CalCal" width={36} height={36} />
          </div>
          <div className="w-full bg-[var(--border)] rounded-full h-2 mb-3">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), #d4824a)" }}
            ></div>
          </div>
          <p className="text-xs text-[var(--text-faint)] font-semibold">Step {step} of {totalSteps}</p>
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="fade-in">
            <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2 text-center">What&apos;s your main goal?</h2>
            <p className="text-[var(--text-muted)] text-sm text-center mb-6 font-medium">This shapes every recommendation we make for you.</p>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    goal === g.id
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="w-9 h-9 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary-text)] flex-shrink-0">
                    <Icon name={g.icon} size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--foreground)] text-sm">{g.label}</p>
                    <p className="text-xs text-[var(--text-muted)] font-medium">{g.desc}</p>
                  </div>
                  {goal === g.id && (
                    <span className="ml-auto w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              disabled={!goal}
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-[var(--primary)] text-white font-extrabold py-3.5 rounded-2xl hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-cozy"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Restrictions */}
        {step === 2 && (
          <div className="fade-in">
            <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2 text-center">Any dietary restrictions?</h2>
            <p className="text-[var(--text-muted)] text-sm text-center mb-6 font-medium">Select all that apply — we&apos;ll filter everything accordingly.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {RESTRICTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRestriction(r)}
                  className={`p-3.5 rounded-2xl border-2 text-sm font-bold transition-all ${
                    restrictions.includes(r)
                      ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary-text)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-2xl border-2 border-[var(--border)] text-[var(--text-muted)] font-semibold hover:border-[var(--border-strong)] transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 bg-[var(--primary)] text-white font-extrabold py-3.5 rounded-2xl hover:bg-[var(--primary-hover)] transition-colors shadow-cozy">
                {restrictions.length === 0 ? "Skip" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Eating style */}
        {step === 3 && (
          <div className="fade-in">
            <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2 text-center">How do you usually eat?</h2>
            <p className="text-[var(--text-muted)] text-sm text-center mb-6 font-medium">This helps us pick the most practical recommendations.</p>
            <div className="space-y-3 mb-6">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    style === s.id
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="w-9 h-9 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary-text)] flex-shrink-0">
                    <Icon name={s.icon} size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[var(--foreground)] text-sm">{s.label}</p>
                    <p className="text-xs text-[var(--text-muted)] font-medium">{s.desc}</p>
                  </div>
                  {style === s.id && (
                    <span className="w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-2xl border-2 border-[var(--border)] text-[var(--text-muted)] font-semibold hover:border-[var(--border-strong)] transition-colors">
                Back
              </button>
              <button
                disabled={!style}
                onClick={() => setStep(4)}
                className="flex-1 bg-[var(--primary)] text-white font-extrabold py-3.5 rounded-2xl hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-cozy"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Meals per day + permissions */}
        {step === 4 && (
          <div className="fade-in">
            <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2 text-center">Last step</h2>
            <p className="text-[var(--text-muted)] text-sm text-center mb-6 font-medium">Almost done. A couple quick settings.</p>

            <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-6 mb-4 shadow-cozy">
              <label className="block text-sm font-extrabold text-[var(--foreground)] mb-3">
                Meals per day: <span style={{ color: "var(--primary)" }}>{meals}</span>
              </label>
              <input
                type="range"
                min={2}
                max={5}
                value={meals}
                onChange={(e) => setMeals(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
                style={{ accentColor: "var(--primary)" }}
              />
              <div className="flex justify-between text-xs text-[var(--text-faint)] font-semibold mt-1">
                <span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { icon: "calendar" as IconName, label: "Google Calendar access", desc: "To find your meal windows" },
                { icon: "map-pin" as IconName, label: "Location access", desc: "To recommend nearby restaurants" },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-4 bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-4">
                  <div className="w-9 h-9 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary-text)] flex-shrink-0">
                    <Icon name={p.icon} size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--foreground)]">{p.label}</p>
                    <p className="text-xs text-[var(--text-muted)] font-medium">{p.desc}</p>
                  </div>
                  <div className="w-10 h-6 rounded-full flex items-center justify-end pr-1" style={{ background: "var(--primary)" }}>
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-2xl border-2 border-[var(--border)] text-[var(--text-muted)] font-semibold hover:border-[var(--border-strong)] transition-colors">
                Back
              </button>
              <button
                onClick={finish}
                className="flex-1 bg-[var(--primary)] text-white font-extrabold py-3.5 rounded-2xl hover:bg-[var(--primary-hover)] transition-colors shadow-cozy"
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
