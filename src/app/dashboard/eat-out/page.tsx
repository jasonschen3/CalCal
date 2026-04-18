"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GradeBadge } from "@/components/ui/GradeBadge";
import type { Restaurant, MenuItem } from "@/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-xs">
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      <span className="text-gray-400 ml-1">{rating}</span>
    </span>
  );
}

function PriceLevel({ level }: { level: number }) {
  return <span className="text-gray-400 text-xs">{"$".repeat(level)}{"·".repeat(3 - level)}</span>;
}

function getUserProfile() {
  try {
    const raw = localStorage.getItem("calcal_profile");
    if (!raw) return { goal: "high_protein", restrictions: [] as string[] };
    const p = JSON.parse(raw);
    return {
      goal: p.goal ?? "high_protein",
      restrictions: (p.restrictions ?? []) as string[],
    };
  } catch {
    return { goal: "high_protein", restrictions: [] as string[] };
  }
}

export default function EatOutPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("Requesting your location...");
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const { goal, restrictions } = getUserProfile();
        setLoadingStatus("Finding restaurants near you...");

        const params = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
          goal,
          restrictions: restrictions.join(","),
        });

        fetch(`/api/restaurants?${params}`)
          .then(async (r) => {
            const data = await r.json();
            if (!r.ok) throw new Error(data.error ?? "API error");
            return data;
          })
          .then((data) => {
            if (Array.isArray(data)) setRestaurants(data);
            else setError("No restaurants found nearby.");
          })
          .catch((e: Error) => setError(e.message))
          .finally(() => setLoading(false));
      },
      (err) => {
        console.error("Geolocation error:", err.code, err.message);
        const msg =
          err.code === 1
            ? "Location access denied. Enable location permissions to see nearby restaurants."
            : `Could not get your location (code ${err.code}: ${err.message})`;
        setError(msg);
        setLoading(false);
      },
      { timeout: 30000, maximumAge: 60000 }
    );
  }, []);

  const handleSelectRestaurant = (r: Restaurant) => {
    setSelectedRestaurant(r);
    setMenuLoading(true);
    setMenuItems([]);

    const { goal, restrictions } = getUserProfile();
    const params = new URLSearchParams({
      name: r.name,
      cuisine: r.cuisine,
      goal,
      restrictions: restrictions.join(","),
    });

    fetch(`/api/restaurants/${r.id}/menu?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMenuItems(data);
      })
      .catch(() => {})
      .finally(() => setMenuLoading(false));
  };

  if (selectedRestaurant) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
            <button onClick={() => setSelectedRestaurant(null)} className="text-gray-500 hover:text-gray-700 text-sm">
              ← Restaurants
            </button>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-900">{selectedRestaurant.name}</span>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedRestaurant.name}</h1>
                <p className="text-sm text-gray-500">{selectedRestaurant.cuisine}</p>
              </div>
              <GradeBadge grade={selectedRestaurant.grade} size="lg" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={selectedRestaurant.rating} />
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500">{selectedRestaurant.distance} · {selectedRestaurant.distanceMinutes} min</span>
              <span className="text-gray-300">·</span>
              <PriceLevel level={selectedRestaurant.priceLevel} />
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <p className="text-sm text-green-700">{selectedRestaurant.reason}</p>
            </div>
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-4">Best dishes for your goal</h2>

          {menuLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item, i) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    </div>
                    <GradeBadge grade={item.grade} />
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-3">{item.reason}</p>
                  {(item.estimatedCalories || item.estimatedProtein) && (
                    <div className="flex gap-3">
                      {item.estimatedCalories && (
                        <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                          ~{item.estimatedCalories} cal
                        </span>
                      )}
                      {item.estimatedProtein && (
                        <span className="text-xs bg-green-50 border border-green-100 text-green-700 px-2.5 py-1 rounded-full">
                          {item.estimatedProtein}g protein
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
          <span className="font-semibold text-gray-900">Nearby Restaurants</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">📍</span>
          <p className="text-sm text-gray-500">Current location · Ranked by goal fit</p>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-6">Best options near you</h1>

        {loading && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">{loadingStatus}</p>
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-32 rounded-2xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-orange-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {restaurants.map((restaurant, i) => (
              <button
                key={restaurant.id}
                onClick={() => handleSelectRestaurant(restaurant)}
                className="w-full bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                      <p className="text-xs text-gray-400">{restaurant.cuisine}</p>
                    </div>
                  </div>
                  <GradeBadge grade={restaurant.grade} />
                </div>
                <div className="flex items-center gap-3 mb-2 ml-9">
                  <StarRating rating={restaurant.rating} />
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{restaurant.distanceMinutes} min away</span>
                  <span className="text-gray-300">·</span>
                  <PriceLevel level={restaurant.priceLevel} />
                </div>
                <p className="text-sm text-gray-600 ml-9">{restaurant.reason}</p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
