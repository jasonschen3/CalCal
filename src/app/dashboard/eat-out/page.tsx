"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { mockRestaurants, mockMenuItems } from "@/lib/mock-data";
import type { Restaurant } from "@/types";

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
  const [loading, setLoading] = useState(false);

  const handleSelectRestaurant = (r: Restaurant) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRestaurant(r);
      setLoading(false);
    }, 800);
  };

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
          <div className="space-y-4">
            {mockMenuItems.map((item, i) => (
              <div key={item.id} className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-5 shadow-cozy">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] text-xs font-extrabold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-[var(--foreground)]">{item.name}</h3>
                  </div>
                  <GradeBadge grade={item.grade} />
                </div>
                {item.description && (
                  <p className="text-xs text-[var(--text-faint)] mb-2 font-medium">{item.description}</p>
                )}
                <p className="text-sm text-[var(--text-muted)] mb-3 font-medium">{item.reason}</p>
                {(item.estimatedCalories || item.estimatedProtein) && (
                  <div className="flex gap-3">
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
              </div>
            ))}
          </div>
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
          <span className="font-bold text-[var(--foreground)]">Nearby Restaurants</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-[var(--text-muted)]">📍</span>
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
                  <GradeBadge grade={restaurant.grade} />
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
