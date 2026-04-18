import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const sessionCount = await prisma.session.count().catch(() => -1);
  const userCount = await prisma.user.count().catch(() => -1);
  return NextResponse.json({ session, sessionCount, userCount });
}
