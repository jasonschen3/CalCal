import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import type { MenuItem } from "@/types";

const anthropic = new Anthropic();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await params; // id available if needed for caching later

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "";
  const cuisine = searchParams.get("cuisine") ?? "";
  const goal = searchParams.get("goal") ?? "high_protein";
  const restrictions = searchParams.get("restrictions") ?? "none";

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a nutrition expert. Generate 4-5 realistic menu items for this restaurant.

Restaurant: ${name}
Cuisine type: ${cuisine}
User's goal: ${goal}
Dietary restrictions: ${restrictions}

Return a JSON array only (no other text). Each item:
{
  "id": "mi_1",
  "name": "actual dish name from this restaurant/cuisine",
  "grade": "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C",
  "reason": "one sentence explaining grade relative to user's ${goal} goal",
  "estimatedCalories": number,
  "estimatedProtein": number,
  "description": "brief ingredient list"
}

Order by grade descending. Return only the JSON array.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text.trim() : "[]";

  try {
    // Strip any markdown fences Claude might add
    const clean = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    const items: MenuItem[] = JSON.parse(clean);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to parse menu" }, { status: 500 });
  }
}
