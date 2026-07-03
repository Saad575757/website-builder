export interface LogoAnalysis {
  brandStyle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  brandingNotes: string;
}

export interface BusinessInfo {
  companyName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  website: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface AIGenerationInput {
  companyName: string;
  description: string;
  category: string;
  location: string;
  logoAnalysis: LogoAnalysis;
}

export interface PageStructure {
  title: string;
  slug: string;
  sections: SectionStructure[];
}

export interface SectionStructure {
  type: string;
  content: Record<string, unknown>;
  styles: Record<string, unknown>;
  sortOrder: number;
}

export interface GeneratedWebsite {
  theme: GeneratedTheme;
  pages: PageStructure[];
  seo: SEOData;
}

export interface GeneratedTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  shadow: string;
  spacing: string;
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  structuredData: Record<string, unknown>;
}

export interface SectionDefinition {
  type: string;
  label: string;
  icon: string;
  category: string;
  defaultContent: Record<string, unknown>;
  defaultStyles: Record<string, unknown>;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  pages: PageStructure[];
  theme: GeneratedTheme;
}

export interface BuilderState {
  projectId: string;
  currentPage: string;
  pages: PageStructure[];
  theme: GeneratedTheme;
  selectedSection: string | null;
  isDragging: boolean;
  previewMode: "desktop" | "tablet" | "mobile";
}

export interface DragItem {
  id: string;
  type: string;
  index: number;
  pageId: string;
}

export interface AIAgentConfig {
  model: keyof typeof import("@/lib/openrouter")["AI_MODELS"];
  temperature: number;
  maxTokens: number;
}
