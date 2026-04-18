"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = "", onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] shadow-cozy ${
        hover ? "cursor-pointer hover:shadow-cozy-md hover:border-[var(--border-strong)] transition-all duration-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
