"use client";

import type { Grade } from "@/types";

interface GradeBadgeProps {
  grade: Grade;
  size?: "sm" | "md" | "lg";
}

export function GradeBadge({ grade, size = "md" }: GradeBadgeProps) {
  const colorClass =
    grade === "A+"
      ? "grade-aplus"
      : grade === "A" || grade === "A-"
        ? "grade-a"
        : grade.startsWith("B")
          ? "grade-b"
          : "grade-c";

  const sizeClass =
    size === "sm"
      ? "text-xs px-2.5 py-0.5 font-bold"
      : size === "lg"
        ? "text-lg px-4 py-1.5 font-extrabold"
        : "text-sm px-3 py-1 font-bold";

  return (
    <span className={`inline-flex items-center ${colorClass} ${sizeClass}`}>
      {grade}
    </span>
  );
}
