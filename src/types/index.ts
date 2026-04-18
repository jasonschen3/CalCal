export type Grade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  goal: "fat_loss" | "maintenance" | "muscle_gain" | "high_energy" | "high_protein";
  restrictions: string[];
  preferences: string[];
  dislikes: string[];
  eatingStyle: "grab_and_go" | "sit_down" | "budget" | "convenience";
  mealsPerDay: number;
  onboardingComplete: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
}

export interface MealWindow {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  urgency: "now" | "soon" | "upcoming";
  recommendedPath: "eat_out" | "eat_at_home" | "flexible";
  grade?: Grade;
  note?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  distanceMinutes: number;
  grade: Grade;
  reason: string;
  address: string;
  priceLevel: number;
  photoUrl?: string;
  orderUrl?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  grade: Grade;
  reason: string;
  estimatedCalories?: number;
  estimatedProtein?: number;
  description?: string;
  customizations?: string[];
}

export interface MealChoice {
  id: string;
  mealWindowId: string;
  type: "eat_out" | "eat_at_home";
  restaurant?: Restaurant;
  menuItem?: MenuItem;
  homeRecommendation?: HomeRecommendation;
  grade: Grade;
  timestamp: string;
}

export interface HomeRecommendation {
  bestOption: string;
  alternatives: string[];
  estimatedCalories?: number;
  estimatedProtein?: number;
  grade: Grade;
  explanation: string;
}

export interface DailySummary {
  date: string;
  meals: MealChoice[];
  overallGrade: Grade;
  breakdown: { label: string; grade: Grade }[];
}
