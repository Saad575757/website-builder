import { queryAIJSON } from "@/lib/openrouter";
import type { ModelTier } from "@/lib/openrouter";
import type { AIAgentConfig, SEOData, PageStructure } from "@/types";

const SYSTEM_PROMPT = `You are an SEO expert and technical marketing specialist. Generate comprehensive SEO data for business websites.

For each page, generate:
- metaTitle: 50-60 chars, include primary keyword
- metaDescription: 150-160 chars, compelling with CTA
- keywords: 5-10 relevant keywords/phrases
- ogTitle: Open Graph title (40-60 chars)
- ogDescription: Open Graph description (80-120 chars)
- structuredData: JSON-LD structured data appropriate for the business type

Also generate global SEO:
- site meta title template
- site meta description
- global keywords
- Twitter card settings
- hreflang if applicable

Return JSON with { seo: SEOData, pageSEO: Record<string, PageSEO> }`;

interface PageSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  structuredData: Record<string, unknown>;
}

export async function generateSEO(
  companyName: string,
  description: string,
  category: string,
  pages: PageStructure[],
  config?: Partial<AIAgentConfig>
): Promise<{ seo: SEOData; pageSEO: Record<string, PageSEO> }> {
  const prompt = JSON.stringify({
    companyName,
    description,
    category,
    pages: pages.map((p) => ({ title: p.title, slug: p.slug })),
    task: "Generate complete SEO metadata and structured data for all pages",
  });

  return queryAIJSON<{ seo: SEOData; pageSEO: Record<string, PageSEO> }>(
    prompt,
    SYSTEM_PROMPT,
    (config?.model as ModelTier) ?? "standard"
  );
}
