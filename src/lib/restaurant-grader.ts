import type { Grade } from "@/types";

type Goal = "fat_loss" | "muscle_gain" | "high_protein" | "high_energy" | "maintenance";

// Cuisine keywords → label
const CUISINE_PATTERNS: { keywords: string[]; label: string }[] = [
  { keywords: ["sushi", "ramen", "japanese", "izakaya", "teriyaki"], label: "Japanese" },
  { keywords: ["chinese", "panda", "wok", "dim sum", "dumpling"], label: "Chinese" },
  { keywords: ["taco", "burrito", "chipotle", "mexican", "qdoba", "torta"], label: "Mexican" },
  { keywords: ["pizza", "italian", "pasta", "trattoria", "osteria"], label: "Italian" },
  { keywords: ["cava", "sweetgreen", "salad", "bowl", "freshii", "tender greens"], label: "Salads & Bowls" },
  { keywords: ["burger", "shake shack", "five guys", "smashburger", "habit"], label: "Burgers" },
  { keywords: ["thai", "pad thai", "basil", "noodle"], label: "Thai" },
  { keywords: ["indian", "curry", "tandoor", "biryani"], label: "Indian" },
  { keywords: ["mediterranean", "falafel", "hummus", "kebab", "shawarma"], label: "Mediterranean" },
  { keywords: ["poke", "aloha", "pokémon"], label: "Poke" },
  { keywords: ["bbq", "barbecue", "smokehouse", "brisket"], label: "BBQ" },
  { keywords: ["subway", "sandwich", "deli", "panera", "jersey mike"], label: "Sandwiches" },
];

const GOAL_PREFERRED: Record<Goal, string[]> = {
  fat_loss: ["Salads & Bowls", "Japanese", "Mediterranean", "Poke"],
  muscle_gain: ["Mexican", "Mediterranean", "Japanese", "American", "Poke"],
  high_protein: ["Mexican", "Mediterranean", "Japanese", "Poke", "Salads & Bowls"],
  high_energy: ["Mediterranean", "Italian", "Mexican", "Japanese"],
  maintenance: ["Mediterranean", "Japanese", "Italian", "Mexican"],
};

const RESTRICTION_RISKY: Record<string, string[]> = {
  gluten_free: ["Italian", "Sandwiches", "Burgers"],
  vegetarian: ["BBQ", "Burgers"],
  vegan: ["BBQ", "Burgers", "Japanese"],
};

function gradeScore(score: number): Grade {
  if (score >= 9) return "A+";
  if (score >= 8) return "A";
  if (score >= 7) return "A-";
  if (score >= 6) return "B+";
  if (score >= 5) return "B";
  if (score >= 4) return "B-";
  if (score >= 3) return "C+";
  return "C";
}

export function inferCuisine(name: string): string {
  const lower = name.toLowerCase();
  for (const { keywords, label } of CUISINE_PATTERNS) {
    if (keywords.some((k) => lower.includes(k))) return label;
  }
  return "Restaurant";
}

export function gradeRestaurant(
  restaurant: { name: string; rating: number; priceLevel: number },
  goal: Goal,
  restrictions: string[]
): { cuisine: string; grade: Grade; reason: string } {
  const cuisine = inferCuisine(restaurant.name);
  let score = 5;

  const preferred = GOAL_PREFERRED[goal] ?? [];
  const isPreferred = preferred.includes(cuisine);
  if (isPreferred) score += 2;

  if (restaurant.rating >= 4.5) score += 1;
  else if (restaurant.rating < 3.5) score -= 1;

  if (restaurant.priceLevel === 1) score -= 0.5; // fast food risk
  if (goal === "fat_loss" && restaurant.priceLevel >= 2) score += 0.5;

  for (const restriction of restrictions) {
    const risky = RESTRICTION_RISKY[restriction] ?? [];
    if (risky.includes(cuisine)) score -= 2;
  }

  score = Math.max(0, Math.min(10, score));

  const goalLabel: Record<Goal, string> = {
    fat_loss: "fat loss",
    muscle_gain: "muscle gain",
    high_protein: "high-protein",
    high_energy: "high-energy",
    maintenance: "your goals",
  };

  const reason = isPreferred
    ? `Strong fit for ${goalLabel[goal]} — ${cuisine} options align well with your macros`
    : `Moderate fit — check the menu for ${goalLabel[goal]}-friendly options`;

  return { cuisine, grade: gradeScore(score), reason };
}
