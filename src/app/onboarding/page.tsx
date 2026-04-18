"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  { id: "fat_loss", label: "Fat Loss", icon: "🔥", desc: "Prioritize lower calorie, high satiety meals" },
  { id: "muscle_gain", label: "Muscle Gain", icon: "💪", desc: "Maximize protein and recovery nutrition" },
  { id: "high_protein", label: "High Protein", icon: "🥩", desc: "Hit protein targets across every meal" },
  { id: "high_energy", label: "High Energy", icon: "⚡", desc: "Fuel focus and performance throughout the day" },
  { id: "maintenance", label: "Maintenance", icon: "⚖️", desc: "Balanced eating, no drastic changes" },
];

const RESTRICTIONS = [
  "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Halal", "Kosher", "Low carb", "Nut-free",
];

const STYLES = [
  { id: "grab_and_go", label: "Grab & Go", desc: "Quick and easy, minimal effort" },
  { id: "sit_down", label: "Sit-down meals", desc: "Prefer proper meal breaks" },
  { id: "budget", label: "Budget-conscious", desc: "Value and affordability matter" },
  { id: "convenience", label: "Convenience-first", desc: "Whatever is closest and fastest" },
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#eff6ff] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CC</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">Step {step} of {totalSteps}</p>
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">What&apos;s your main goal?</h2>
            <p className="text-gray-500 text-sm text-center mb-6">This shapes every recommendation we make for you.</p>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    goal === g.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{g.label}</p>
                    <p className="text-xs text-gray-500">{g.desc}</p>
                  </div>
                  {goal === g.id && (
                    <span className="ml-auto w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              disabled={!goal}
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Restrictions */}
        {step === 2 && (
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Any dietary restrictions?</h2>
            <p className="text-gray-500 text-sm text-center mb-6">Select all that apply — we&apos;ll filter everything accordingly.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {RESTRICTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRestriction(r)}
                  className={`p-3.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    restrictions.includes(r)
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-100 bg-white text-gray-700 hover:border-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors">
                {restrictions.length === 0 ? "Skip" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Eating style */}
        {step === 3 && (
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">How do you usually eat?</h2>
            <p className="text-gray-500 text-sm text-center mb-6">This helps us pick the most practical recommendations.</p>
            <div className="space-y-3 mb-6">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    style === s.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{s.label}</p>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                  {style === s.id && (
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button
                disabled={!style}
                onClick={() => setStep(4)}
                className="flex-1 bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Meals per day + permissions */}
        {step === 4 && (
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Last step</h2>
            <p className="text-gray-500 text-sm text-center mb-6">Almost done. A couple quick settings.</p>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Meals per day: <span className="text-green-600">{meals}</span>
              </label>
              <input
                type="range"
                min={2}
                max={5}
                value={meals}
                onChange={(e) => setMeals(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { icon: "📅", label: "Google Calendar access", desc: "To find your meal windows" },
                { icon: "📍", label: "Location access", desc: "To recommend nearby restaurants" },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4">
                  <span className="text-xl">{p.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </div>
                  <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button
                onClick={finish}
                className="flex-1 bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors"
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
