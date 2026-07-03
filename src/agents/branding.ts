import { queryAIJSON } from "@/lib/openrouter";
import type { ModelTier } from "@/lib/openrouter";
import type { AIAgentConfig, LogoAnalysis } from "@/types";

const SYSTEM_PROMPT = `You are a professional brand identity designer and color theorist. Analyze the provided business information and logo description to create a comprehensive brand identity. Return a JSON object with:

- brandStyle: The brand's visual style (e.g., "Modern Minimalist", "Bold & Playful", "Elegant Luxury", "Rustic & Natural", "Tech-forward", "Creative & Artistic")
- primaryColor: Main brand color as hex (choose based on industry psychology)
- secondaryColor: Secondary brand color as hex
- accentColor: Accent/highlight color as hex
- fontHeading: Recommended heading font (Google Fonts name like "Inter", "Playfair Display", "Space Grotesk")
- fontBody: Recommended body font (Google Fonts name)
- brandingNotes: Brief notes on the brand identity rationale

Rules:
- Colors must have proper contrast ratios
- Fonts should pair well together
- Match the industry and brand personality
- Use valid 6-digit hex codes with # prefix`;

export async function analyzeBranding(
  companyName: string,
  description: string,
  category: string,
  logoDescription: string,
  config?: Partial<AIAgentConfig>
): Promise<LogoAnalysis> {
  const prompt = JSON.stringify({
    companyName,
    description,
    category,
    logoDescription,
    task: "Generate complete brand identity with colors, fonts, and style guidelines",
  });

  return queryAIJSON<LogoAnalysis>(
    prompt,
    SYSTEM_PROMPT,
    (config?.model as ModelTier) ?? "standard"
  );
}
