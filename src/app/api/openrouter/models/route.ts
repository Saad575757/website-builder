import { NextResponse } from "next/server";
import { AI_MODELS } from "@/lib/openrouter";

export async function GET() {
  const models = Object.entries(AI_MODELS).map(([tier, model]) => ({
    tier,
    model,
  }));

  return NextResponse.json({ models });
}
