import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Client } from "@googlemaps/google-maps-services-js";
import { gradeRestaurant } from "@/lib/restaurant-grader";
import type { Restaurant } from "@/types";

const mapsClient = new Client({});

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const goal = (searchParams.get("goal") ?? "high_protein") as Parameters<typeof gradeRestaurant>[1];
  const restrictions = searchParams.get("restrictions")?.split(",").filter(Boolean) ?? [];

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const response = await mapsClient.placesNearby({
    params: {
      location: { lat, lng },
      radius: 1600, // ~1 mile
      type: "restaurant",
      key: process.env.GOOGLE_MAPS_API_KEY!,
    },
  });

  if (response.data.status !== "OK" && response.data.status !== "ZERO_RESULTS") {
    return NextResponse.json({ error: `Places API: ${response.data.status}` }, { status: 502 });
  }

  const gradeOrder = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C"];

  const restaurants: Restaurant[] = (response.data.results ?? [])
    .slice(0, 15)
    .map((place, i) => {
      const { cuisine, grade, reason } = gradeRestaurant(
        {
          name: place.name ?? "",
          rating: place.rating ?? 3.5,
          priceLevel: place.price_level ?? 2,
        },
        goal,
        restrictions
      );

      const placeLat = place.geometry?.location.lat ?? lat;
      const placeLng = place.geometry?.location.lng ?? lng;
      const dist = distanceMiles(lat, lng, placeLat, placeLng);
      const distanceMinutes = Math.max(1, Math.round(dist / 0.05)); // ~3mph walk

      const photoRef = place.photos?.[0]?.photo_reference;
      const photoUrl = photoRef
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        : undefined;

      return {
        id: place.place_id ?? `r_${i}`,
        name: place.name ?? "",
        cuisine,
        rating: place.rating ?? 3.5,
        distance: `${dist.toFixed(1)} mi`,
        distanceMinutes,
        grade,
        reason,
        address: place.vicinity ?? "",
        priceLevel: place.price_level ?? 2,
        photoUrl,
      };
    })
    .sort((a, b) => gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade));

  return NextResponse.json(restaurants);
}
