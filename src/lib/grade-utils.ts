import type { Grade } from "@/types";

const GRADE_SCORES: Record<string, number> = {
  "A+": 10, "A": 9, "A-": 8,
  "B+": 7,  "B": 6, "B-": 5,
  "C+": 4,  "C": 3,
};

export function gradeToScore(grade: string): number {
  return GRADE_SCORES[grade] ?? 6;
}

export function scoreToGrade(score: number): Grade {
  if (score >= 9.5) return "A+";
  if (score >= 8.5) return "A";
  if (score >= 7.5) return "A-";
  if (score >= 6.5) return "B+";
  if (score >= 5.5) return "B";
  if (score >= 4.5) return "B-";
  if (score >= 3.5) return "C+";
  return "C";
}

export function averageGrade(grades: string[]): Grade {
  if (!grades.length) return "A";
  const avg = grades.reduce((sum, g) => sum + gradeToScore(g), 0) / grades.length;
  return scoreToGrade(avg);
}

export function getMealLabel(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 10) return "Breakfast";
  if (h >= 10 && h < 15) return "Lunch";
  if (h >= 15 && h < 21) return "Dinner";
  return "Snack";
}

export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}
