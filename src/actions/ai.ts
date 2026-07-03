"use server";

import { auth } from "@clerk/nextjs/server";
import { analyzeBranding } from "@/agents/branding";
import { generateContent } from "@/agents/content";
import { generateSEO } from "@/agents/seo";
import type { ModelTier } from "@/lib/openrouter";

export async function regenerateContent(
  companyName: string,
  description: string,
  category: string,
  tier: ModelTier = "fast"
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const result = await generateContent(companyName, description, category, [], {
      model: tier,
      temperature: 0.7,
      maxTokens: 4096,
    });
    return { pages: result.pages };
  } catch {
    return { error: "Content generation failed" };
  }
}

export async function regenerateSEO(
  companyName: string,
  description: string,
  category: string
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const result = await generateSEO(companyName, description, category, []);
    return { seo: result.seo, pageSEO: result.pageSEO };
  } catch {
    return { error: "SEO generation failed" };
  }
}

export async function generateBlogContent(
  topic: string,
  keywords: string,
  tone: string = "professional"
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const { queryAIJSON } = await import("@/lib/openrouter");
    const result = await queryAIJSON<{
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
    }>(
      JSON.stringify({
        topic,
        keywords: keywords.split(",").map((k) => k.trim()),
        tone,
        length: "1200-1500 words",
      }),
      "You are an expert content writer. Generate a well-researched, SEO-optimized blog post. Return JSON with title, excerpt, content (HTML formatted), and tags array.",
      "standard"
    );
    return result;
  } catch {
    return { error: "Blog generation failed" };
  }
}

export async function analyzeBrandingAction(
  companyName: string,
  description: string,
  category: string
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const analysis = await analyzeBranding(
      companyName,
      description,
      category,
      `Business logo for ${companyName}`
    );
    return analysis;
  } catch {
    return { error: "Brand analysis failed" };
  }
}
