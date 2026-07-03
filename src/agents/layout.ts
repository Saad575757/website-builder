import { queryAIJSON } from "@/lib/openrouter";
import type { ModelTier } from "@/lib/openrouter";
import type { AIAgentConfig, PageStructure, GeneratedTheme } from "@/types";

const SYSTEM_PROMPT = `You are an expert UX/UI architect and website layout designer. Generate complete website structures based on business information.

For each business category, create appropriate pages and sections:

Restaurant: Hero, About, Menu, Gallery, Reservation, Testimonials, Contact
Agency: Hero, Services, Portfolio, Team, Testimonials, Pricing, FAQ, Contact
Medical: Hero, Doctors, Services, Testimonials, Appointment, Contact
Real Estate: Hero, Featured Listings, Agents, Testimonials, Contact
Construction: Hero, Projects, Services, Team, Testimonials, Contact
Fitness: Hero, Classes, Trainers, Schedule, Pricing, Contact
Beauty: Hero, Services, Gallery, Team, Testimonials, Contact
Education: Hero, Courses, Features, Faculty, Testimonials, Contact
Travel: Hero, Destinations, Packages, Gallery, Testimonials, Contact
Finance: Hero, Services, Calculators, Team, Testimonials, Contact
Automotive: Hero, Inventory, Services, Gallery, Testimonials, Contact

Each section must have:
- type: section identifier
- content: object with all necessary fields
- styles: styling overrides (can be empty object)
- sortOrder: position index

Return JSON with { pages: PageStructure[] }`;

export async function generateLayout(
  companyName: string,
  description: string,
  category: string,
  theme: GeneratedTheme,
  config?: Partial<AIAgentConfig>
): Promise<{ pages: PageStructure[] }> {
  const prompt = JSON.stringify({
    companyName,
    description,
    category,
    theme,
    task: "Generate complete website page and section layout structure",
  });

  return queryAIJSON<{ pages: PageStructure[] }>(
    prompt,
    SYSTEM_PROMPT,
    (config?.model as ModelTier) ?? "standard"
  );
}
