"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GradeBadge } from "@/components/ui/GradeBadge";
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

      // Convert image to base64 so Claude can actually see it
      let imageBase64: string | null = null;
      let imageMimeType: string | null = null;
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        imageMimeType = file.type || "image/jpeg";
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            // Strip the "data:image/jpeg;base64," prefix, keep only raw base64
            resolve(dataUrl.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const res = await fetch("/api/ai/home-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodDescription: text,
          imageBase64,
          imageMimeType,
          goal: profile.goal || "high_protein",
          restrictions: profile.restrictions || [],
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback mock result
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
      <div className="min-h-screen bg-[#f8f9fa]">
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
            <button onClick={() => setResult(null)} className="text-gray-500 hover:text-gray-700 text-sm">
              ← Try again
            </button>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-900">Your Recommendation</span>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-6 py-8 fade-in">
          {/* Recognized foods */}
          {result.recognizedFoods && result.recognizedFoods.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <p className="text-xs text-gray-400 font-medium mb-3"> WHAT I SPOTTED</p>
              <div className="flex flex-wrap gap-2">
                {result.recognizedFoods.map((food, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-50 border border-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Best option */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">BEST OPTION RIGHT NOW</p>
                <h2 className="text-lg font-bold text-gray-900">{result.bestOption}</h2>
              </div>
              <GradeBadge grade={result.grade} size="lg" />
            </div>
            <p className="text-sm text-gray-600 mb-4">{result.explanation}</p>
            <div className="flex gap-3">
              {result.estimatedCalories && (
                <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                  ~{result.estimatedCalories} cal (est.)
                </span>
              )}
              {result.estimatedProtein && (
                <span className="text-xs bg-green-50 border border-green-100 text-green-700 px-3 py-1.5 rounded-full">
                  ~{result.estimatedProtein}g protein (est.)
                </span>
              )}
            </div>
          </div>

          {/* Alternatives */}
          {result.alternatives.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
              <p className="text-xs text-gray-400 font-medium mb-3">ALTERNATIVES</p>
              <div className="space-y-2">
                {result.alternatives.map((alt, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400 font-bold w-4">{i + 2}</span>
                    <p className="text-sm text-gray-700">{alt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mb-6">
            * Nutrition estimates are approximate. Values may vary based on portion size.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-900">Eat at Home</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">What do you have?</h1>
        <p className="text-gray-500 text-sm mb-8">
          Upload a photo of your fridge or pantry, or just describe what you have. We&apos;ll recommend the best meal for your goal.
        </p>

        {!loading ? (
          <>
            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => { setInputMode("photo"); fileInputRef.current?.click(); }}
                className={`bg-white rounded-2xl border-2 p-5 text-center transition-all ${
                  inputMode === "photo" ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="text-3xl mb-2">📸</div>
                <p className="font-semibold text-gray-900 text-sm">Take a photo</p>
                <p className="text-xs text-gray-400 mt-1">Snap fridge or pantry</p>
              </button>
              <button
                onClick={() => setInputMode("text")}
                className={`bg-white rounded-2xl border-2 p-5 text-center transition-all ${
                  inputMode === "text" ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="text-3xl mb-2">✍️</div>
                <p className="font-semibold text-gray-900 text-sm">Describe it</p>
                <p className="text-xs text-gray-400 mt-1">Type what you have</p>
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
                <img src={imagePreview} alt="Food" className="w-full rounded-2xl border border-gray-100 object-cover max-h-64" />
              </div>
            )}

            {/* Text input */}
            {(inputMode === "text" || text) && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. eggs, Greek yogurt, leftover rice, spinach, bread, cheese..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100 resize-none mb-4"
              />
            )}

            {(imagePreview || text.length > 3) && (
              <button
                onClick={handleAnalyze}
                className="w-full bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors"
              >
                Get my recommendation →
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">{loadingMessage}</p>
            <p className="text-xs text-gray-400 mt-2">Powered by Claude AI</p>
          </div>
        )}
      </main>
    </div>
  );
}
