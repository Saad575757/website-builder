import { queryAIJSON } from "@/lib/openrouter";
import type { ModelTier } from "@/lib/openrouter";
import type { AIAgentConfig, PageStructure } from "@/types";

const SYSTEM_PROMPT = `You are an expert copywriter and content strategist. Generate compelling, SEO-optimized content for business websites.

Write content that:
- Matches the industry tone (professional for law/medical, casual for restaurants/fitness)
- Includes clear calls-to-action
- Is persuasive and conversion-focused
- Incorporates relevant keywords naturally
- Uses proper HTML formatting where appropriate
- Is unique and original

For each section type, provide complete content:

Hero: headline, subheadline, ctaText, backgroundImage suggestion
About: title, paragraphs[], mission, vision, stats[]
Services: title, items[] with { title, description, icon }
Features: title, items[] with { title, description, icon }
Team: title, members[] with { name, role, bio, image }
Testimonials: title, items[] with { name, role, content, rating }
FAQ: title, items[] with { question, answer }
Contact: title, email, phone, address, formFields[]
Menu (restaurant): title, categories[] with { name, items[] }
Portfolio: title, projects[] with { title, category, image, description }
Gallery: title, images[] with { url, alt, caption }

Return JSON with { pages: PageStructure[] } where each section has populated content`;

export async function generateContent(
  companyName: string,
  description: string,
  category: string,
  pages: PageStructure[],
  config?: Partial<AIAgentConfig>
): Promise<{ pages: PageStructure[] }> {
  const prompt = JSON.stringify({
    companyName,
    description,
    category,
    pages: pages.map((p) => ({
      title: p.title,
      slug: p.slug,
      sections: p.sections.map((s) => ({ type: s.type, sortOrder: s.sortOrder })),
    })),
    task: "Generate compelling marketing content for all website sections",
  });

  return queryAIJSON<{ pages: PageStructure[] }>(
    prompt,
    SYSTEM_PROMPT,
    (config?.model as ModelTier) ?? "fast"
  );
}
