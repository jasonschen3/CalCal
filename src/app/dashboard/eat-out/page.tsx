"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { Icon } from "@/components/ui/Icon";
import { mockRestaurants, mockMenuItems } from "@/lib/mock-data";
import type { Restaurant, MenuItem } from "@/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-500 text-xs">
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      <span className="text-[var(--text-faint)] ml-1 font-medium">{rating}</span>
    </span>
  );
}

function PriceLevel({ level }: { level: number }) {
  return <span className="text-[var(--text-faint)] text-xs font-semibold">{"$".repeat(level)}{"·".repeat(3 - level)}</span>;
}

export default function EatOutPage() {
  const router = useRouter();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectRestaurant = (r: Restaurant) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRestaurant(r);
      setLoading(false);
    }, 800);
  };

  const handleOrderThis = () => {
    setOrdered(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  const handleCopy = () => {
    if (!selectedDish) return;
    const text = selectedDish.customizations?.join("\n") ?? selectedDish.name;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOrderOnline = () => {
    if (!selectedRestaurant) return;
    window.open(selectedRestaurant.orderUrl ?? "https://order.cava.com", "_blank");
  };

  // — Dish detail view —
  if (selectedDish && selectedRestaurant) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <nav className="bg-[var(--surface-raised)] border-b-2 border-[var(--border)]">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedDish(null)}
              className="text-[var(--text-muted)] hover:text-[var(--foreground)] text-sm font-semibold transition-colors"
            >
              ← {selectedRestaurant.name}
            </button>
            <span className="text-[var(--border-strong)]">|</span>
            <span className="font-bold text-[var(--foreground)] truncate">{selectedDish.name}</span>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-6 py-8 fade-in">
          {/* Grade hero */}
          <div className="bg-gradient-to-br from-[var(--primary)] to-[#d4824a] rounded-3xl p-6 mb-5 text-white shadow-cozy-md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="stamp text-white/80 mb-2">Best match for your goal</span>
                <h1 className="text-2xl font-extrabold mt-2 leading-tight">{selectedDish.name}</h1>
                {selectedDish.description && (
                  <p className="text-white/75 text-sm font-medium mt-1">{selectedDish.description}</p>
                )}
              </div>
              <GradeBadge grade={selectedDish.grade} size="lg" />
            </div>
            <div className="flex gap-3 mt-4">
              {selectedDish.estimatedCalories && (
                <div className="bg-white/15 rounded-2xl px-4 py-2.5 text-center">
                  <p className="text-white font-extrabold text-lg leading-none">{selectedDish.estimatedCalories}</p>
                  <p className="text-white/70 text-xs font-semibold mt-0.5">calories</p>
                </div>
              )}
              {selectedDish.estimatedProtein && (
                <div className="bg-white/15 rounded-2xl px-4 py-2.5 text-center">
                  <p className="text-white font-extrabold text-lg leading-none">{selectedDish.estimatedProtein}g</p>
                  <p className="text-white/70 text-xs font-semibold mt-0.5">protein</p>
                </div>
              )}
              <div className="bg-white/15 rounded-2xl px-4 py-2.5 text-center">
                <p className="text-white font-extrabold text-lg leading-none">{selectedRestaurant.distanceMinutes}m</p>
                <p className="text-white/70 text-xs font-semibold mt-0.5">away</p>
              </div>
            </div>
          </div>

          {/* Why it fits */}
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 mb-5 shadow-cozy">
            <p className="text-xs text-[var(--text-faint)] font-bold mb-2 uppercase tracking-wide">Why this dish</p>
            <p className="text-[var(--foreground)] font-medium text-sm leading-relaxed">{selectedDish.reason}</p>
          </div>

          {/* From restaurant */}
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-4 mb-8 shadow-cozy flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary-text)]">
                <Icon name="utensils" size={16} />
              </div>
              <div>
                <p className="font-bold text-[var(--foreground)] text-sm">{selectedRestaurant.name}</p>
                <p className="text-xs text-[var(--text-faint)] font-medium">{selectedRestaurant.distance} · {selectedRestaurant.distanceMinutes} min walk</p>
              </div>
            </div>
            <StarRating rating={selectedRestaurant.rating} />
          </div>

          {/* Exact Order Card */}
          {selectedDish.customizations && selectedDish.customizations.length > 0 && (
            <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 mb-4 shadow-cozy">
              <div className="flex items-center justify-between mb-3">
                <span className="stamp text-[var(--text-muted)]">Exact Order</span>
                <button
                  onClick={handleCopy}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border-2 transition-all"
                  style={copied
                    ? { borderColor: "var(--grade-a)", color: "var(--grade-a)", background: "var(--grade-a-bg)" }
                    : { borderColor: "var(--border-strong)", color: "var(--primary-text)", background: "var(--primary-light)" }
                  }
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <ul className="space-y-1.5">
                {selectedDish.customizations.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)] font-medium">
                    <span className="text-[var(--primary)] font-bold mt-0.5">•</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          {!ordered ? (
            <>
              <button
                onClick={handleOrderOnline}
                className="w-full text-white font-extrabold text-base py-4 rounded-full flex items-center justify-center gap-3 active:translate-y-1 transition-all tracking-wide mb-3"
                style={{
                  background: "linear-gradient(135deg, #f4833d, #e05520)",
                  boxShadow: "0 5px 0 #a83d12, 0 8px 24px rgba(224, 85, 32, 0.45)",
                }}
              >
                <Icon name="utensils" size={18} />
                Order on CAVA.com →
              </button>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => window.open("https://www.doordash.com/search/store/CAVA/", "_blank")}
                  className="text-xs font-bold px-4 py-2 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)] transition-colors"
                >
                  DoorDash
                </button>
                <button
                  onClick={() => window.open("https://www.ubereats.com/search?q=CAVA", "_blank")}
                  className="text-xs font-bold px-4 py-2 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)] transition-colors"
                >
                  Uber Eats
                </button>
                <button
                  onClick={handleOrderThis}
                  className="text-xs font-bold px-4 py-2 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)] transition-colors"
                >
                  Log meal
                </button>
              </div>
            </>
          ) : (
            <div className="w-full bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] py-4 flex items-center justify-center gap-3 shadow-cozy fade-in">
              <div className="w-5 h-5 bg-[var(--grade-a-bg)] rounded-full flex items-center justify-center">
                <span className="text-[var(--grade-a)] text-xs font-extrabold">✓</span>
              </div>
              <p className="font-bold text-[var(--foreground)]">Logged! Heading back…</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // — Restaurant detail (dish list) view —
  if (selectedRestaurant) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <nav className="bg-[var(--surface-raised)] border-b-2 border-[var(--border)]">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
            <button onClick={() => setSelectedRestaurant(null)} className="text-[var(--text-muted)] hover:text-[var(--foreground)] text-sm font-semibold transition-colors">
              ← Restaurants
            </button>
            <span className="text-[var(--border-strong)]">|</span>
            <span className="font-bold text-[var(--foreground)]">{selectedRestaurant.name}</span>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-6 py-8">
          {/* Restaurant header */}
          <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-6 mb-6 shadow-cozy">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-xl font-extrabold text-[var(--foreground)]">{selectedRestaurant.name}</h1>
                <p className="text-sm text-[var(--text-muted)] font-medium">{selectedRestaurant.cuisine}</p>
              </div>
              <GradeBadge grade={selectedRestaurant.grade} size="lg" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={selectedRestaurant.rating} />
              <span className="text-[var(--border-strong)]">·</span>
              <span className="text-xs text-[var(--text-muted)] font-medium">{selectedRestaurant.distance} · {selectedRestaurant.distanceMinutes} min</span>
              <span className="text-[var(--border-strong)]">·</span>
              <PriceLevel level={selectedRestaurant.priceLevel} />
            </div>
            <div className="bg-[var(--primary-light)] border-2 border-[var(--border-strong)] rounded-2xl px-4 py-3">
              <p className="text-sm text-[var(--primary-text)] font-medium">{selectedRestaurant.reason}</p>
            </div>
          </div>

          {/* Menu recommendations */}
          <h2 className="text-base font-extrabold text-[var(--foreground)] mb-4">Best dishes for your goal</h2>
          <div className="space-y-3">
            {mockMenuItems.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setSelectedDish(item)}
                className="w-full text-left bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy hover:shadow-cozy-md hover:border-[var(--border-strong)] transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-[var(--foreground)]">{item.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <GradeBadge grade={item.grade} />
                    <span className="text-[var(--border-strong)] font-bold">›</span>
                  </div>
                </div>
                {item.description && (
                  <p className="text-xs text-[var(--text-faint)] mb-2 font-medium ml-8">{item.description}</p>
                )}
                <p className="text-sm text-[var(--text-muted)] mb-3 font-medium ml-8">{item.reason}</p>
                {(item.estimatedCalories || item.estimatedProtein) && (
                  <div className="flex gap-2 ml-8">
                    {item.estimatedCalories && (
                      <span className="text-xs bg-[var(--background)] border-2 border-[var(--border)] text-[var(--text-muted)] px-2.5 py-1 rounded-full font-semibold">
                        ~{item.estimatedCalories} cal
                      </span>
                    )}
                    {item.estimatedProtein && (
                      <span className="text-xs bg-[var(--primary-light)] border-2 border-[var(--border-strong)] text-[var(--primary-text)] px-2.5 py-1 rounded-full font-semibold">
                        {item.estimatedProtein}g protein
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // — Restaurant list view —
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="bg-[var(--surface-raised)] border-b-2 border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-[var(--text-muted)] hover:text-[var(--foreground)] text-sm font-semibold transition-colors">
            ← Back
          </button>
          <span className="text-[var(--border-strong)]">|</span>
          <span className="font-bold text-[var(--foreground)]">Nearby Restaurants</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="map-pin" size={14} className="text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-muted)] font-medium">Current location · Ranked by goal fit</p>
        </div>
        <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-6">Best options near you</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-32 rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mockRestaurants.map((restaurant, i) => (
              <button
                key={restaurant.id}
                onClick={() => handleSelectRestaurant(restaurant)}
                className="w-full bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 text-left hover:shadow-cozy-md hover:border-[var(--border-strong)] transition-all shadow-cozy"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] text-xs font-extrabold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">{restaurant.name}</h3>
                      <p className="text-xs text-[var(--text-faint)] font-medium">{restaurant.cuisine}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GradeBadge grade={restaurant.grade} />
                    <span className="text-[var(--border-strong)] font-bold">›</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2 ml-10">
                  <StarRating rating={restaurant.rating} />
                  <span className="text-[var(--border-strong)]">·</span>
                  <span className="text-xs text-[var(--text-muted)] font-medium">{restaurant.distanceMinutes} min away</span>
                  <span className="text-[var(--border-strong)]">·</span>
                  <PriceLevel level={restaurant.priceLevel} />
                </div>
                <p className="text-sm text-[var(--text-muted)] ml-10 font-medium">{restaurant.reason}</p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
