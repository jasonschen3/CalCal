import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const GOAL_LABELS: Record<string, string> = {
  fat_loss: "fat loss (lower calories, high satiety, high protein)",
  muscle_gain: "muscle gain (high protein, calorie surplus)",
  high_protein: "high protein intake",
  high_energy: "sustained energy and focus",
  maintenance: "balanced nutrition",
};

export async function POST(req: NextRequest) {
  try {
    const { foodDescription, goal, restrictions, imageIncluded } = await req.json();

    const goalLabel = GOAL_LABELS[goal] || "balanced nutrition";
    const restrictionText = restrictions?.length
      ? `Dietary restrictions: ${restrictions.join(", ")}.`
      : "";

    const prompt = `You are a nutrition copilot. A user wants to eat at home and needs a recommendation.

User goal: ${goalLabel}
${restrictionText}
${imageIncluded ? "The user has uploaded a photo of their fridge/pantry." : ""}
${foodDescription ? `Available foods: ${foodDescription}` : "Assume a typical well-stocked kitchen."}

Provide a concise meal recommendation in this exact JSON format (no markdown, just JSON):
{
  "bestOption": "specific meal name or description",
  "alternatives": ["alternative 1", "alternative 2"],
  "estimatedCalories": 520,
  "estimatedProtein": 36,
  "grade": "A",
  "explanation": "one or two sentences explaining why this is the best choice"
}

Rules:
- Grade must be one of: A+, A, A-, B+, B, B-, C+, C
- bestOption should be specific (e.g. "Scrambled eggs with Greek yogurt and berries")
- explanation should be practical and reference the user's goal
- estimatedCalories and estimatedProtein are estimates — keep them realistic
- If you can not identify food from an image description, still give a reasonable recommendation`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text.trim());
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI recommendation error:", err);
    return NextResponse.json(
      {
        bestOption: "Greek yogurt with eggs and fruit",
        alternatives: ["Scrambled eggs on toast", "Yogurt parfait with granola"],
        estimatedCalories: 480,
        estimatedProtein: 32,
        grade: "A",
        explanation: "High-protein combination that fits your goal efficiently and is quick to prepare.",
      },
      { status: 200 }
    );
  }
}
