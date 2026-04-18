"use client";

import type { Grade } from "@/types";

interface GradeBadgeProps {
  grade: Grade;
  size?: "sm" | "md" | "lg";
}

export function GradeBadge({ grade, size = "md" }: GradeBadgeProps) {
  const colorClass =
    grade === "A+" || grade === "A" || grade === "A-"
      ? "grade-a"
      : grade.startsWith("B")
        ? "grade-b"
        : "grade-c";

  const sizeClass =
    size === "sm"
      ? "text-xs px-2 py-0.5 font-semibold"
      : size === "lg"
        ? "text-xl px-4 py-1.5 font-bold"
        : "text-sm px-2.5 py-1 font-semibold";

  return (
    <span
      className={`inline-flex items-center rounded-full ${colorClass} ${sizeClass}`}
    >
      {grade}
    </span>
  );
}
