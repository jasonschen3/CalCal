import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { averageGrade } from "@/lib/grade-utils";
import type { Grade } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceStr = since.toISOString().split("T")[0];

  const logs = await prisma.mealLog.findMany({
    where: { userId: session.user.id, date: { gte: sinceStr } },
    orderBy: { createdAt: "asc" },
  });

  // Group by date
  const byDate = new Map<string, typeof logs>();
  for (const log of logs) {
    if (!byDate.has(log.date)) byDate.set(log.date, []);
    byDate.get(log.date)!.push(log);
  }

  const days = Array.from(byDate.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // newest first
    .map(([date, entries]) => ({
      date,
      grade: averageGrade(entries.map((e) => e.grade)) as Grade,
      meals: entries.map((e) => ({
        label: e.label,
        grade: e.grade as Grade,
        name: e.name,
        type: e.type,
      })),
    }));

  return NextResponse.json(days);
}
