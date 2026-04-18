import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { averageGrade, todayString } from "@/lib/grade-utils";
import type { Grade } from "@/types";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { label, type, name, grade, details } = body;

  if (!label || !type || !name || !grade) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const log = await prisma.mealLog.create({
    data: {
      userId: session.user.id,
      date: todayString(),
      label,
      type,
      name,
      grade,
      details: details ? JSON.stringify(details) : null,
    },
  });

  return NextResponse.json(log);
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? todayString();

  const logs = await prisma.mealLog.findMany({
    where: { userId: session.user.id, date },
    orderBy: { createdAt: "asc" },
  });

  const dailyGrade: Grade | null = logs.length
    ? averageGrade(logs.map((l) => l.grade))
    : null;

  return NextResponse.json({ logs, dailyGrade });
}
