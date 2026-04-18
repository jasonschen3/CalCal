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

type AllowedMimeType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

function toAllowedMime(mime: string): AllowedMimeType {
  const allowed: AllowedMimeType[] = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return allowed.includes(mime as AllowedMimeType) ? (mime as AllowedMimeType) : "image/jpeg";
}

export async function POST(req: NextRequest) {
  try {
    const { foodDescription, goal, restrictions, imageBase64, imageMimeType } = await req.json();

    const goalLabel = GOAL_LABELS[goal] || "balanced nutrition";
    const restrictionText = restrictions?.length
      ? `Dietary restrictions: ${restrictions.join(", ")}.`
      : "";

    const textPrompt = `You are a nutrition copilot. A user wants to eat at home and needs a recommendation.

User goal: ${goalLabel}
${restrictionText}
${imageBase64 ? "The user has uploaded a photo of their fridge/pantry — analyze the visible foods and base your recommendation on what you see." : ""}
${foodDescription ? `Additional context from user: ${foodDescription}` : ""}
${!imageBase64 && !foodDescription ? "Assume a typical well-stocked kitchen." : ""}

IMPORTANT: Respond with ONLY raw JSON. No markdown, no code fences, no explanation outside the JSON.

Return this exact JSON structure:
{"recognizedFoods":["food 1","food 2"],"bestOption":"specific meal name","alternatives":["alt 1","alt 2"],"estimatedCalories":520,"estimatedProtein":36,"grade":"A","explanation":"one or two sentences"}

Rules:
- recognizedFoods: list every distinct food item you can identify from the image or text. If nothing provided, use []
- grade must be one of: A+, A, A-, B+, B, B-, C+, C
- bestOption should be specific (e.g. "Scrambled eggs with Greek yogurt and berries")
- explanation should be practical and reference the user's goal
- If image is provided, base your recommendation ONLY on what you actually see in it`;

    const messageContent: Anthropic.MessageParam["content"] = [];

    if (imageBase64) {
      (messageContent as Anthropic.ImageBlockParam[]).push({
        type: "image",
        source: {
          type: "base64",
          media_type: toAllowedMime(imageMimeType || "image/jpeg"),
          data: imageBase64,
        },
      });
    }

    (messageContent as Anthropic.TextBlockParam[]).push({ type: "text", text: textPrompt });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{ role: "user", content: messageContent }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";
    console.log("Claude raw response:", rawText.substring(0, 300));
    const cleaned = rawText.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI recommendation error:", String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
